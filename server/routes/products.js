import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { isAuth, isManagerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', isAuth, async (req, res) => {
  try {
    const { search, category, status, sortBy, order, page = 1, limit = 10 } = req.query;
    
    // Build query filters
    const filters = {};
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filters.category = category;
    }
    
    if (status) {
      filters.status = status;
    }
    
    // Build sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('createdBy', 'name');
    
    // Get total count for pagination
    const total = await Product.countDocuments(filters);
    
    res.json({
      products,
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

// Get single product by ID
router.get('/:id', isAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product
router.post(
  '/',
  [
    isAuth,
    isManagerOrAdmin,
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('sku').notEmpty().withMessage('SKU is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('costPrice').isNumeric().withMessage('Cost price must be a number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if SKU already exists
      const skuExists = await Product.findOne({ sku: req.body.sku });
      if (skuExists) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      
      const newProduct = new Product({
        ...req.body,
        createdBy: req.user.id
      });
      
      const product = await newProduct.save();
      res.status(201).json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product
router.put(
  '/:id',
  [
    isAuth,
    isManagerOrAdmin,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if product exists
      let product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // If SKU is being changed, check if new SKU already exists
      if (req.body.sku && req.body.sku !== product.sku) {
        const skuExists = await Product.findOne({ sku: req.body.sku });
        if (skuExists) {
          return res.status(400).json({ message: 'SKU already exists' });
        }
      }
      
      // Update product
      product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      
      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product
router.delete('/:id', [isAuth, isManagerOrAdmin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product stock
router.patch(
  '/:id/stock',
  [
    isAuth,
    body('quantity').isInt().withMessage('Quantity must be an integer'),
    body('operation').isIn(['add', 'subtract']).withMessage('Operation must be add or subtract')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { quantity, operation } = req.body;
    
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      if (operation === 'add') {
        product.stock += quantity;
      } else if (operation === 'subtract') {
        if (product.stock < quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
        product.stock -= quantity;
      }
      
      // Update status based on stock
      if (product.stock === 0) {
        product.status = 'Out of Stock';
      } else if (product.status === 'Out of Stock') {
        product.status = 'Active';
      }
      
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get low stock products
router.get('/reports/low-stock', isAuth, async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lte: 10 },
      status: { $ne: 'Inactive' }
    });
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;