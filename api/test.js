// Simple test endpoint for Vercel deployment
module.exports = (req, res) => {
  res.status(200).json({
    message: "API test endpoint working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};