// Auto-fill booking form from URL parameters
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    
    if (data) {
        try {
            const bookingData = JSON.parse(atob(data));
            
            // Fill form fields with slight delay to ensure DOM is ready
            setTimeout(() => {
                if (bookingData.fullname) document.getElementById('fullname').value = bookingData.fullname;
                if (bookingData.mobile) document.getElementById('mobile').value = bookingData.mobile;
                if (bookingData.checkin) document.getElementById('checkin').value = bookingData.checkin;
                if (bookingData.checkout) document.getElementById('checkout').value = bookingData.checkout;
                if (bookingData.adult || bookingData.adults) document.getElementById('adult').value = bookingData.adult || bookingData.adults;
                if (bookingData.children) document.getElementById('children').value = bookingData.children;
                if (bookingData.occupancy) {
                    const occupancySelect = document.getElementById('occupancy');
                    occupancySelect.value = bookingData.occupancy;
                }
                if (bookingData.extraBed) document.getElementById('extraBed').checked = bookingData.extraBed;
                
                // Trigger calculations
                calculateNights();
                calculatePrice();
                
                // Scroll to form
                document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Show notification
                alert('Booking details loaded! Please upload payment receipt and submit.');
            }, 100);
        } catch (e) {
            console.error('Error loading booking data:', e);
        }
    }
});

// Calculate nights between check-in and check-out
function calculateNights() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    
    if (checkin && checkout) {
        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        document.getElementById('nightCount').textContent = nights > 0 ? nights : 0;
        calculatePrice();
    }
}

// Calculate total price with GST
function calculatePrice() {
    const roomPrices = {
        'standard.html': 2500,
        'executive.html': 3500,
        'super executive.html': 4500,
        'Suite.html': 6000
    };
    
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    let basePrice = roomPrices[currentPage] || 2500;
    
    const occupancy = document.getElementById('occupancy').value;
    const extraBed = document.getElementById('extraBed').checked;
    const nights = parseInt(document.getElementById('nightCount').textContent) || 0;
    
    if (occupancy === 'double') basePrice += 500;
    
    const roomAmount = basePrice * nights;
    const extraBedAmount = extraBed ? (500 * nights) : 0;
    const totalBase = roomAmount + extraBedAmount;
    const taxAmount = Math.round(totalBase * 0.05);
    const totalAmount = totalBase + taxAmount;
    
    document.getElementById('baseRate').textContent = totalBase;
    document.getElementById('taxAmount').textContent = taxAmount;
    document.getElementById('totalAmount').textContent = totalAmount;
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('payment_receipt');
            const file = fileInput.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveBooking(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                saveBooking(null);
            }
            
            function saveBooking(receiptData) {
                const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                const mobile = document.getElementById('mobile').value;
                const checkin = document.getElementById('checkin').value;
                const room = document.querySelector('.breadcrumb-title h2').textContent;
                
                // Check if booking already exists (from generated link)
                const existingIndex = bookings.findIndex(b => b.mobile === mobile && b.checkin === checkin && b.room === room);
                
                const notification = document.getElementById('fixedNotification');
                
                if (existingIndex !== -1) {
                    // Update existing booking with receipt
                    bookings[existingIndex].receipt = receiptData;
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    notification.textContent = '✓ Receipt uploaded! Booking ID: ' + bookings[existingIndex].id;
                    notification.style.display = 'block';
                    notification.style.background = '#28a745';
                    notification.style.color = 'white';
                } else {
                    // Create new booking
                    const formData = {
                        id: 'BK' + Date.now(),
                        fullname: document.getElementById('fullname').value,
                        mobile: mobile,
                        checkin: checkin,
                        checkout: document.getElementById('checkout').value,
                        adults: document.getElementById('adult').value,
                        children: document.getElementById('children').value,
                        occupancy: document.getElementById('occupancy').value,
                        extraBed: document.getElementById('extraBed').checked,
                        nights: document.getElementById('nightCount').textContent,
                        amount: document.getElementById('totalAmount').textContent,
                        room: room,
                        receipt: receiptData,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    };
                    
                    bookings.push(formData);
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    notification.textContent = '✓ Booking submitted! ID: ' + formData.id;
                    notification.style.display = 'block';
                    notification.style.background = '#28a745';
                    notification.style.color = 'white';
                }
                
                setTimeout(() => {
                    notification.style.display = 'none';
                    form.reset();
                    document.getElementById('nightCount').textContent = '0';
                    document.getElementById('baseRate').textContent = '0';
                    document.getElementById('taxAmount').textContent = '0';
                    document.getElementById('totalAmount').textContent = '0';
                }, 3000);
            }
        });
    }
});
