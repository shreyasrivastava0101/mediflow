const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['ICU', 'Emergency', 'Observation', 'General'], required: true },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  currentPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);
