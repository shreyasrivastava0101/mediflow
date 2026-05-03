const Bed = require('../models/Bed');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const totalBeds = await Bed.countDocuments();
    const occupiedBeds = await Bed.countDocuments({ status: 'Occupied' });
    const availableBeds = await Bed.countDocuments({ status: 'Available' });
    
    // Applying date filter only to patients for now as a simple implementation
    const totalPatients = await Patient.countDocuments(query);
    const admittedPatients = await Patient.countDocuments({ ...query, status: 'Admitted' });
    const waitingPatients = await Patient.countDocuments({ ...query, status: 'Waiting' });
    
    const totalDoctors = await Doctor.countDocuments();
    const busyDoctors = await Doctor.countDocuments({ status: 'Busy' });

    // Bed type breakdown
    const bedStats = await Bed.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 }, occupied: { $sum: { $cond: [{ $eq: ["$status", "Occupied"] }, 1, 0] } } } }
    ]);

    // Generate mock time-series data for the chart based on the request
    // In a real app, this would aggregate Patient admission times.
    const chartData = [
      { time: '00:00', ICU: 8, Emergency: 15, General: 20 },
      { time: '04:00', ICU: 7, Emergency: 12, General: 18 },
      { time: '08:00', ICU: 9, Emergency: 18, General: 25 },
      { time: '12:00', ICU: 10, Emergency: 25, General: 30 },
      { time: '16:00', ICU: 10, Emergency: 22, General: 28 },
      { time: '20:00', ICU: 9, Emergency: 19, General: 24 },
      { time: '24:00', ICU: 8, Emergency: 16, General: 22 },
    ];

    res.status(200).json({
      success: true,
      data: {
        beds: { total: totalBeds, occupied: occupiedBeds, available: availableBeds, breakdown: bedStats },
        patients: { total: totalPatients, admitted: admittedPatients, waiting: waitingPatients },
        doctors: { total: totalDoctors, busy: busyDoctors, available: totalDoctors - busyDoctors },
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
