import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', [isAuth, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', isAuth, async (req, res) => {
  try {
    // Regular users can only access their own profile
    if (!isAdmin(req) && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put(
  '/profile',
  [
    isAuth,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, avatar } = req.body;
    
    try {
      // If email is changed, check if it already exists
      if (email) {
        const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
      
      // Update user profile
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { name, email, avatar } },
        { new: true }
      ).select('-password');
      
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Change password
router.put(
  '/password',
  [
    isAuth,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    try {
      const user = await User.findById(req.user.id);
      
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update user role (admin only)
router.put(
  '/:id/role',
  [
    isAuth,
    isAdmin,
    body('role')
      .isIn(['admin', 'manager', 'staff'])
      .withMessage('Invalid role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.role = req.body.role;
      await user.save();
      
      res.json(user);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete user (admin only)
router.delete('/:id', [isAuth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;