const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db'); // Adjust the path to your database connection file

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// ------------------- AUTH ROUTES ------------------- //

// **1. Register a New User**
router.post(
    '/register',
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('email')
        .isEmail().withMessage('Invalid email address')
        .custom((email) => {
          const personalEmailProviders = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com',
            'icloud.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com'
          ];
  
          const domain = email.split('@')[1]; // Extract domain from email
          if (personalEmailProviders.includes(domain)) {
            throw new Error('Personal email addresses are not allowed. Please use a work email.');
          }
  
          return true; // Email is valid
        }),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      body('role').optional().isIn(['client', 'admin', 'coworker']).withMessage('Invalid role'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, email, password, role } = req.body;
  
      try {
        // Check if the user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'Email is already registered' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert the new user into the database
        await db.query(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, role || 'client']
        );
  
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
  

// **2. Login a User**
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if the user exists
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = users[0];

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate a JWT token
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role,
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token });
        } catch (err) {
            console.error('Error logging in:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// **3. Protected Route Example**
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// ------------------- MIDDLEWARE ------------------- //

// **Authenticate Token**
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

// **Role-based Access Control**
function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}

// **Example Admin-only Route**
router.get('/admin-dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
