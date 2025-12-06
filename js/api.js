const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Booking functions
async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`);
  return await res.json();
}

async function createBooking(data) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function updateBooking(id, data) {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function deleteBooking(id) {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Admin functions
async function registerAdmin(data) {
  const res = await fetch(`${API_URL}/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function loginAdmin(data) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
