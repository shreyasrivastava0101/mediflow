const Bed = require('../models/Bed');
const Patient = require('../models/Patient');

exports.getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate('currentPatient');
    res.status(200).json({ success: true, count: beds.length, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.releaseBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    if (bed.currentPatient) {
      await Patient.findByIdAndUpdate(bed.currentPatient, { status: 'Discharged', assignedBed: null });
    }

    bed.status = 'Available';
    bed.currentPatient = null;
    await bed.save();

    res.status(200).json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reassignBed = async (req, res) => {
  try {
    const { patientId } = req.body;
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });
    if (bed.status !== 'Available') return res.status(400).json({ success: false, message: 'Bed is occupied' });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    // Free up old bed if applicable
    if (patient.assignedBed) {
      await Bed.findByIdAndUpdate(patient.assignedBed, { status: 'Available', currentPatient: null });
    }

    bed.status = 'Occupied';
    bed.currentPatient = patient._id;
    await bed.save();

    patient.assignedBed = bed._id;
    patient.status = 'Admitted';
    await patient.save();

    res.status(200).json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
