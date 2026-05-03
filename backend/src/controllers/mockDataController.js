const Bed = require('../models/Bed');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

exports.seedDatabase = async (req, res) => {
  try {
    await Bed.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const adminUser = await User.create({ name: 'System Admin', email: 'admin@mediflow.com', password: hashedPassword, role: 'Admin' });
    const doctorUser = await User.create({ name: 'Dr. House', email: 'doctor@mediflow.com', password: hashedPassword, role: 'Doctor' });
    const staffUser = await User.create({ name: 'Front Desk', email: 'staff@mediflow.com', password: hashedPassword, role: 'Receptionist' });

    // Seed Beds
    const beds = [];
    for (let i = 1; i <= 50; i++) {
      let type = 'General';
      if (i <= 10) type = 'ICU';
      else if (i <= 20) type = 'Emergency';
      else if (i <= 30) type = 'Observation';
      
      beds.push({
        bedNumber: `B-${i.toString().padStart(3, '0')}`,
        type,
        status: 'Available'
      });
    }
    const createdBeds = await Bed.insertMany(beds);

    // Seed Doctors
    const specializations = ['Cardiologist', 'Pulmonologist', 'Dermatologist', 'General Physician', 'Neurologist', 'Orthopedist'];
    const cities = ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Austin', 'Boston'];
    const doctors = [];
    for (let i = 1; i <= 30; i++) {
      doctors.push({
        name: `Dr. Smith ${i}`,
        specialization: specializations[i % specializations.length],
        city: cities[i % cities.length],
        rating: Number((4.2 + (i % 6) * 0.1).toFixed(1)),
        status: 'Available',
        maxPatients: 10
      });
    }
    const createdDoctors = await Doctor.insertMany(doctors);

    // Seed Patients
    const patients = [];
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const genders = ['Male', 'Female'];
    const symptomsList = ['Chest pain', 'Breathing issue', 'Skin rash', 'Fever', 'Headache', 'Joint pain'];

    for (let i = 1; i <= 100; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const symptom = symptomsList[Math.floor(Math.random() * symptomsList.length)];
      
      patients.push({
        name: `Patient ${i}`,
        age: Math.floor(Math.random() * 80) + 1,
        gender: genders[Math.floor(Math.random() * genders.length)],
        symptoms: [symptom],
        severity,
        status: 'Waiting'
      });
    }
    const createdPatients = await Patient.insertMany(patients);

    // Seed Appointments (200 random slots)
    const appointments = [];
    for (let i = 0; i < 200; i++) {
      const rPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const rDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
      
      // Random date within next 7 days
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 7));
      date.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

      appointments.push({
        patient: rPatient._id,
        doctor: rDoctor._id,
        date,
        status: Math.random() > 0.8 ? 'Completed' : 'Scheduled',
        reason: rPatient.symptoms[0]
      });
    }
    await Appointment.insertMany(appointments);

    // Notifications
    const notifs = [
      { user: adminUser._id, title: 'System Alert', message: 'ICU is nearing capacity.', type: 'Warning' },
      { user: adminUser._id, title: 'Queue Update', message: '5 Critical patients waiting in ER.', type: 'Alert' },
      { user: adminUser._id, title: 'Database Seed', message: 'Mock data initialized successfully.', type: 'Success' }
    ];
    await Notification.insertMany(notifs);

    res.status(200).json({ success: true, message: 'Database seeded successfully with 50 beds, 30 doctors, 100 patients, 200 appointments, and notifications.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
