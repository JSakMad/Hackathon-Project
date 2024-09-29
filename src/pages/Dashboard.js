// Dashboard.js
import React, { useEffect, useState } from 'react'; 
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [energyData, setEnergyData] = useState([]);
  const [sustainabilityScore, setSustainabilityScore] = useState(0);
  const [analysis, setAnalysis] = useState(null);

  // Fetch energy data from the API
  const fetchEnergyData = async () => {
    const response = await fetch('http://11.39.7.247:5000/api/energy-usage');
    const data = await response.json();
    return data;
  };

  // Analyze usage using the Hugging Face API
  const analyzeUsage = async (data) => {
    const response = await fetch('https://api-inference.huggingface.co/models/YOUR_MODEL_NAME', { // Replace with your Hugging Face model
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`, // If your model requires an API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Analyze the following energy data and suggest improvements: ${JSON.stringify(data)}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze usage');
    }
    const analysisResults = await response.json();
    return analysisResults;
  };

  // Calculate sustainability score based on usage
  const calculateSustainabilityScore = (usageData) => {
    const totalConsumption = usageData.reduce((sum, entry) => sum + entry.powerConsumed, 0);
    const averageConsumption = totalConsumption / usageData.length;

    // Simple scoring logic
    const score = Math.max(0, 100 - (totalConsumption / averageConsumption) * 100);
    return score;
  };

  // Load data and perform analysis
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEnergyData();
      setEnergyData(data);
      const analysisResults = await analyzeUsage(data);
      setAnalysis(analysisResults);
      const score = calculateSustainabilityScore(data);
      setSustainabilityScore(score);
    };
    loadData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: energyData.map(entry => entry.packageName), // Use package names as labels
    datasets: [
      {
        label: 'Energy Usage',
        data: energyData.map(entry => entry.powerConsumed),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h2>Energy Usage</h2>
      <Line data={chartData} />
      <h3>Sustainability Score: {sustainabilityScore}</h3>
      {analysis && <div>Analysis: {analysis[0]?.generated_text || "No suggestions available."}</div>} {/* Adjust based on Hugging Face response structure */}
    </div>
  );
}

export default Dashboard;
