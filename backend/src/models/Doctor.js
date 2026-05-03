const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { 
    type: String, 
    enum: ['Cardiologist', 'Pulmonologist', 'Dermatologist', 'General Physician', 'Neurologist', 'Orthopedist'], 
    required: true 
  },
  city: { type: String, default: 'New York' },
  rating: { type: Number, default: 4.7 },
  status: { type: String, enum: ['Available', 'Busy', 'Off-duty'], default: 'Available' },
  currentPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  maxPatients: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
