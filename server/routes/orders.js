import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { isAuth, isManagerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all orders
router.get('/', isAuth, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build query filters
    const filters = {};
    
    if (status) {
      filters.status = status;
    }
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('createdBy', 'name');
    
    // Get total count for pagination
    const total = await Order.countDocuments(filters);
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order by ID
router.get('/:id', isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('items.product', 'name sku');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post(
  '/',
  [
    isAuth,
    body('customer.name').notEmpty().withMessage('Customer name is required'),
    body('customer.email').isEmail().withMessage('Valid customer email is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { items, customer, paymentMethod, notes } = req.body;
      
      // Verify product availability and calculate totals
      let subtotal = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        // Update product stock
        product.stock -= item.quantity;
        if (product.stock === 0) {
          product.status = 'Out of Stock';
        }
        await product.save({ session });
        
        // Add item to order
        const itemPrice = product.price;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        orderItems.push({
          product: product._id,
          name: product.name,
          price: itemPrice,
          quantity: item.quantity
        });
      }
      
      // Calculate tax and total
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      // Create order
      const newOrder = new Order({
        customer,
        items: orderItems,
        subtotal,
        tax,
        total,
        paymentMethod,
        paymentStatus: 'Paid', // Assuming payment is made
        notes,
        createdBy: req.user.id
      });
      
      const order = await newOrder.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(201).json(order);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      
      console.error(err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

// Update order status
router.patch(
  '/:id/status',
  [
    isAuth,
    isManagerOrAdmin,
    body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
      .withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // If cancelling an order, restore product stock
      if (req.body.status === 'Cancelled' && order.status !== 'Cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
          );
        }
      }
      
      order.status = req.body.status;
      await order.save();
      
      res.json(order);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get order statistics
router.get('/stats/overview', [isAuth, isManagerOrAdmin], async (req, res) => {
  try {
    const stats = {
      totalOrders: await Order.countDocuments(),
      pendingOrders: await Order.countDocuments({ status: 'Pending' }),
      processingOrders: await Order.countDocuments({ status: 'Processing' }),
      shippedOrders: await Order.countDocuments({ status: 'Shipped' }),
      deliveredOrders: await Order.countDocuments({ status: 'Delivered' }),
      cancelledOrders: await Order.countDocuments({ status: 'Cancelled' })
    };
    
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    stats.totalSales = totalSales.length > 0 ? totalSales[0].total : 0;
    
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;