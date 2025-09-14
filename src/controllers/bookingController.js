import Booking from '../models/Booking.js';

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Public
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const {
      bookingId,
      customer,
      product,
      date,
      time,
      duration,
      address,
      status,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!bookingId || !customer || !product || !date || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create booking
    const booking = new Booking({
      bookingId,
      customer,
      product,
      date,
      time: time || '10:00',
      duration: duration || { id: '4-hours', name: '4 Hours', price: 150 },
      address: address || '',
      status: status || 'Pending',
      totalAmount
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: `Validation error: ${validationErrors.join(', ')}` });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Public
export const updateBooking = async (req, res) => {
  try {
    const {
      bookingId,
      customer,
      product,
      date,
      time,
      duration,
      address,
      status,
      totalAmount
    } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.bookingId = bookingId || booking.bookingId;
      booking.customer = customer || booking.customer;
      booking.product = product || booking.product;
      booking.date = date || booking.date;
      booking.time = time || booking.time;
      booking.duration = duration || booking.duration;
      booking.address = address || booking.address;
      booking.status = status || booking.status;
      booking.totalAmount = totalAmount || booking.totalAmount;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: `Validation error: ${validationErrors.join(', ')}` });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Public
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      await booking.remove();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: error.message });
  }
};