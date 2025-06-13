const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

// Mock auth endpoints
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', success: true });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', success: true });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint', success: true });
});

module.exports = router;