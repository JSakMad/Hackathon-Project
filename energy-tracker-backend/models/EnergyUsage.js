// energyUsage.js
const mongoose = require('mongoose');

const energyUsageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true
  },
  powerConsumed: {
    type: Number,
    required: true
  }
});

const EnergyUsage = mongoose.model('EnergyUsage', energyUsageSchema);

module.exports = EnergyUsage;
