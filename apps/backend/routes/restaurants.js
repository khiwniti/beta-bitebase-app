const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'restaurants' });
});

// Mock restaurant endpoints
router.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurants endpoint',
    restaurants: [
      { id: 1, name: 'Sample Restaurant 1', cuisine: 'Italian' },
      { id: 2, name: 'Sample Restaurant 2', cuisine: 'Thai' }
    ]
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    message: 'Restaurant details endpoint',
    restaurant: { id: req.params.id, name: 'Sample Restaurant', cuisine: 'Italian' }
  });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create restaurant endpoint', success: true });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update restaurant endpoint', success: true });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete restaurant endpoint', success: true });
});

module.exports = router;