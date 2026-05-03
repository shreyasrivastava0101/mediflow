require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const seedRoutes = require('./src/routes/seedRoutes');
const bedRoutes = require('./src/routes/bedRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const triageRoutes = require('./src/routes/triageRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected to Mediflow Data...'))
  .catch(err => console.log('MongoDB Connection Error: ', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Mediflow API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});