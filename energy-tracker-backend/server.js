// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package
const axios = require('axios'); // Import Axios for making HTTP requests

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (or restrict to specific origins as needed)
app.use(cors()); // Use CORS middleware

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Import EnergyUsage model
const EnergyUsage = require('./models/EnergyUsage');

// Endpoint to add energy usage data
app.post('/api/energy-usage', async (req, res) => {
  const { packageName, powerConsumed } = req.body;

  try {
    if (!packageName || !powerConsumed) {
      return res.status(400).json({ message: 'Package name and power consumed are required' });
    }

    const newUsage = new EnergyUsage({ packageName, powerConsumed });
    await newUsage.save();
    res.status(201).json(newUsage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
  }
});

// Endpoint to get energy usage data
app.get('/api/energy-usage', async (req, res) => {
  try {
    const energyUsageData = await EnergyUsage.find();
    res.status(200).json(energyUsageData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Endpoint to analyze usage with Hugging Face API
app.post('/api/analyze-usage', async (req, res) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY; // Ensure this is set in your .env file
  const { data } = req.body; // Extract data from the request body

  try {
    const response = await axios.post('https://api-inference.huggingface.co/models/google/gemma-2-2b-it', {
      inputs: `Analyze the following energy data and suggest improvements: ${JSON.stringify(data)}`,
      options: { wait_for_model: true },
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error contacting Hugging Face API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
