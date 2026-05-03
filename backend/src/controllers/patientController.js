const Patient = require('../models/Patient');
const Bed = require('../models/Bed');
const Doctor = require('../models/Doctor');

// Helper for mapping symptom to specialization
const getSpecializationForSymptom = (symptoms) => {
  const symptomMap = {
    'Chest pain': 'Cardiologist',
    'Breathing issue': 'Pulmonologist',
    'Skin rash': 'Dermatologist',
    'Fever': 'General Physician',
    'Headache': 'Neurologist',
    'Joint pain': 'Orthopedist'
  };
  
  for (let sym of symptoms) {
    if (symptomMap[sym]) return symptomMap[sym];
  }
  return 'General Physician';
};

// Helper for mapping severity to bed type
const getBedTypeForSeverity = (severity) => {
  switch (severity) {
    case 'Critical': return 'ICU';
    case 'High': return 'Emergency';
    case 'Medium': return 'Observation';
    case 'Low': return 'General';
    default: return 'General';
  }
};

exports.admitPatient = async (req, res) => {
  try {
    const { name, age, gender, symptoms, severity, insurance } = req.body;
    
    let patient = new Patient({ name, age, gender, symptoms, severity, insurance });

    // 1. Doctor Assignment
    const requiredSpecialization = getSpecializationForSymptom(symptoms);
    const availableDoctor = await Doctor.findOne({
      specialization: requiredSpecialization,
      status: 'Available'
    }).sort({ currentPatients: 1 }); // Give to doctor with fewest patients

    if (availableDoctor && availableDoctor.currentPatients.length < availableDoctor.maxPatients) {
      patient.assignedDoctor = availableDoctor._id;
      availableDoctor.currentPatients.push(patient._id);
      if (availableDoctor.currentPatients.length + 1 >= availableDoctor.maxPatients) {
        availableDoctor.status = 'Busy';
      }
      await availableDoctor.save();
    }

    // 2. Smart Bed Allocation
    const requiredBedType = getBedTypeForSeverity(severity);
    const availableBed = await Bed.findOne({
      type: requiredBedType,
      status: 'Available'
    });

    if (availableBed) {
      patient.assignedBed = availableBed._id;
      patient.status = 'Admitted';
      availableBed.status = 'Occupied';
      availableBed.currentPatient = patient._id;
      await availableBed.save();
    } else {
      patient.status = 'Waiting';
    }

    await patient.save();

    res.status(201).json({
      success: true,
      message: patient.status === 'Waiting' ? 'Patient added to waitlist (No beds available)' : 'Patient Admitted successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const { search, status, severity, sort, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) query.status = status;
    if (severity) query.severity = severity;

    let sortObj = { arrivalTime: -1 };
    if (sort === 'oldest') sortObj = { arrivalTime: 1 };
    if (sort === 'name') sortObj = { name: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const patients = await Patient.find(query)
      .populate('assignedBed')
      .populate('assignedDoctor')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Patient.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      count: patients.length, 
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: patients 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPatientQueue = async (req, res) => {
  try {
    const severityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    let patients = await Patient.find({ status: 'Waiting' }).sort({ arrivalTime: 1 });
    
    patients.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    // Release bed if admitted
    if (patient.assignedBed) {
      await Bed.findByIdAndUpdate(patient.assignedBed, { status: 'Available', currentPatient: null });
    }
    // Remove from doctor if assigned
    if (patient.assignedDoctor) {
      await Doctor.findByIdAndUpdate(patient.assignedDoctor, { $pull: { currentPatients: patient._id }, status: 'Available' });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateQueuePriority = async (req, res) => {
  try {
    const { priority } = req.body; // e.g. move up means updating arrivalTime to be earlier artificially or severity
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    patient.severity = priority;
    await patient.save();
    
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
