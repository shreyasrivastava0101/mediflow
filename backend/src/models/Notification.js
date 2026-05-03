const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Alert', 'Info', 'Success', 'Warning'], default: 'Info' },
  read: { type: Boolean, default: false },
  actionUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
