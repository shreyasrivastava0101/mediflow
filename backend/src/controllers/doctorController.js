const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

exports.getDoctors = async (req, res) => {
  try {
    const { search, specialty, city, rating } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (specialty) query.specialization = specialty;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (rating) query.rating = { $gte: Number(rating) };

    const doctors = await Doctor.find(query).populate('currentPatients');
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id }).populate('patient');
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { patientId, date, reason } = req.body;
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Simple conflict check (1 slot per hour)
    const newDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: { 
        $gte: new Date(newDate.getTime() - 30*60000), 
        $lte: new Date(newDate.getTime() + 30*60000) 
      },
      status: 'Scheduled'
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'Scheduling conflict: Slot already booked.' });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: newDate,
      reason
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelSlot = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.appId, { status: 'Cancelled' }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
