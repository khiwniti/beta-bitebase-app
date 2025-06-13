const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users' });
});

// Mock user endpoints
router.get('/', (req, res) => {
  res.json({ 
    message: 'Users endpoint',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    message: 'User details endpoint',
    user: { id: req.params.id, name: 'John Doe', email: 'john@example.com' }
  });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create user endpoint', success: true });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update user endpoint', success: true });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete user endpoint', success: true });
});

module.exports = router;