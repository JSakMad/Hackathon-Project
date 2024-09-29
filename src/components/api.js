// src/components/api.js
const API_BASE_URL = 'http://11.39.7.247:5000/api'; // Your backend API base URL

export const fetchEnergyData = async () => {
  const response = await fetch(`${API_BASE_URL}/energy-usage`);
  if (!response.ok) {
    throw new Error('Failed to fetch energy data');
  }
  return response.json();
};

export const analyzeUsage = async (data) => {
  const response = await fetch('YOUR_AI_API_ENDPOINT', { // Replace with your AI API endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to analyze usage');
  }
  return response.json();
};
