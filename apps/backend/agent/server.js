const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../ui/build')));

// API endpoint to search for restaurants
app.get('/api/restaurants', (req, res) => {
  const { latitude, longitude, radius, platforms } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const args = [
    '-c',
    `
    from bitebase_ai.agents import RestaurantDataAgent
    import json
    import sys

    # Initialize the agent
    agent = RestaurantDataAgent()

    # Run the agent
    try:
        result = agent.execute(
            latitude=${latitude},
            longitude=${longitude},
            radius_km=${radius},
            platforms=${platforms ? JSON.stringify(platforms.split(',')) : 'None'},
            match=False
        )

        # Print the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
    `
  ];

  const pythonProcess = spawn('python3', args);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error(errorString);
      return res.status(500).json({ error: 'Error fetching restaurant data', details: errorString });
    }

    try {
      const jsonData = JSON.parse(dataString);
      res.json(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Error parsing restaurant data' });
    }
  });
});

// API endpoint to match restaurants across platforms
app.get('/api/restaurants/match', (req, res) => {
  const { latitude, longitude, radius, platforms } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const args = [
    '-c',
    `
    from bitebase_ai.agents import RestaurantDataAgent
    import json
    import sys

    # Initialize the agent
    agent = RestaurantDataAgent()

    # Run the agent
    try:
        result = agent.execute(
            latitude=${latitude},
            longitude=${longitude},
            radius_km=${radius},
            platforms=${platforms ? JSON.stringify(platforms.split(',')) : 'None'},
            match=True
        )

        # Print the result as JSON
        print(json.dumps(result.get("matched_restaurants", [])))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
    `
  ];

  const pythonProcess = spawn('python3', args);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error(errorString);
      return res.status(500).json({ error: 'Error matching restaurant data', details: errorString });
    }

    try {
      const jsonData = JSON.parse(dataString);
      res.json(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Error parsing matched restaurant data' });
    }
  });
});

// API endpoint for geocoding
app.get('/api/geocode', (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Missing address parameter' });
  }

  // This is a simplified example - in production, you would use a real geocoding service
  // For now, we'll return mock coordinates for Bangkok
  setTimeout(() => {
    res.json({
      latitude: 13.7563,
      longitude: 100.5018,
      address: address
    });
  }, 500);
});

// API endpoint for data analysis
app.get('/api/analyze', (req, res) => {
  const { latitude, longitude, radius, platforms, analysis_type } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const analysisType = analysis_type || 'comprehensive';

  const args = [
    '-c',
    `
    from bitebase_ai.agents import RestaurantAnalysisAgent
    import json
    import sys

    # Initialize the agent
    agent = RestaurantAnalysisAgent()

    # Run the agent
    try:
        result = agent.execute(
            latitude=${latitude},
            longitude=${longitude},
            radius_km=${radius},
            platforms=${platforms ? JSON.stringify(platforms.split(',')) : 'None'},
            analysis_type="${analysisType}"
        )

        # Print the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
    `
  ];

  const pythonProcess = spawn('python3', args);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error(errorString);
      return res.status(500).json({ error: 'Error analyzing restaurant data', details: errorString });
    }

    try {
      const jsonData = JSON.parse(dataString);
      res.json(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Error parsing analysis data' });
    }
  });
});

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
