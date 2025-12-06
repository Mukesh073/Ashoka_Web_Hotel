const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Schemas
const bookingSchema = new mongoose.Schema({
  id: String,
  fullname: String,
  mobile: String,
  checkin: String,
  checkout: String,
  nights: Number,
  room: String,
  adults: Number,
  children: Number,
  occupancy: String,
  extraBed: Boolean,
  amount: Number,
  receipt: String,
  status: String,
  created_at: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  created_at: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Booking APIs
app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ created_at: -1 });
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

app.put('/api/bookings/:id', async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(booking);
});

app.delete('/api/bookings/:id', async (req, res) => {
  await Booking.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
});

// Admin APIs
app.post('/api/admin/register', async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.json({ success: true });
});

app.post('/api/admin/login', async (req, res) => {
  const admin = await Admin.findOne({ 
    username: req.body.username, 
    password: req.body.password 
  });
  if (admin) {
    res.json({ success: true, admin });
  } else {
    res.status(401).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
