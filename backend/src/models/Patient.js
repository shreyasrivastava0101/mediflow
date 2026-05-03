const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  symptoms: [{ type: String }],
  severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], required: true },
  insurance: { type: String },
  arrivalTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['Waiting', 'Admitted', 'Discharged'], default: 'Waiting' },
  assignedBed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', default: null },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
