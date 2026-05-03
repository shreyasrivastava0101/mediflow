const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Use a demo patient when no authenticated user is present.
    const patientName = req.user?.name || 'Demo Patient';
    let patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      patient = await Patient.create({
        name: patientName,
        age: req.user?.age || 30,
        gender: 'Male',
        symptoms: ['Checkup'],
        severity: 'Low',
        status: 'Waiting'
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      date: new Date(date),
      reason,
      status: 'Scheduled'
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const patientName = req.user?.name || 'Demo Patient';
    const patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      return res.status(200).json({ success: true, data: [] });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
