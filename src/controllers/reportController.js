import Report from '../models/Report.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req, res) => {
  try {
    const { type, period } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (period) query.period = period;
    
    const reports = await Report.find(query).sort({ date: -1 }).limit(50);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and get revenue report
// @route   GET /api/reports/revenue
// @access  Private/Admin
export const getRevenueReport = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    // Calculate revenue from bookings
    const startDate = getStartDate(period);
    const endDate = new Date();
    
    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Save to database
    const report = new Report({
      type: 'revenue',
      period,
      date: endDate,
      value: totalRevenue,
      metadata: {
        bookingCount: bookings.length,
        currency: 'GHS'
      }
    });
    
    await report.save();
    
    res.json(report);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and get bookings report
// @route   GET /api/reports/bookings
// @access  Private/Admin
export const getBookingsReport = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    // Count bookings
    const startDate = getStartDate(period);
    const endDate = new Date();
    
    const bookingCount = await Booking.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Save to database
    const report = new Report({
      type: 'bookings',
      period,
      date: endDate,
      value: bookingCount,
      metadata: {}
    });
    
    await report.save();
    
    res.json(report);
  } catch (error) {
    console.error('Error generating bookings report:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and get equipment utilization report
// @route   GET /api/reports/equipment-utilization
// @access  Private/Admin
export const getEquipmentUtilizationReport = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    // Calculate equipment utilization
    const products = await Product.find({});
    const totalProducts = products.length;
    
    if (totalProducts === 0) {
      return res.json({
        type: 'equipment-utilization',
        period,
        date: new Date(),
        value: 0,
        metadata: {}
      });
    }
    
    // Count products in use
    const inUseProducts = products.filter(product => product.status === 'In Use').length;
    const utilization = Math.round((inUseProducts / totalProducts) * 100);
    
    // Save to database
    const report = new Report({
      type: 'equipment-utilization',
      period,
      date: new Date(),
      value: utilization,
      metadata: {
        totalProducts,
        inUseProducts
      }
    });
    
    await report.save();
    
    res.json(report);
  } catch (error) {
    console.error('Error generating equipment utilization report:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate all reports
// @route   POST /api/reports/generate
// @access  Private/Admin
export const generateAllReports = async (req, res) => {
  try {
    const { period = 'monthly' } = req.body;
    
    // Generate all reports
    const revenueReport = await getRevenueReportData(period);
    const bookingsReport = await getBookingsReportData(period);
    const equipmentReport = await getEquipmentUtilizationReportData(period);
    
    // Save all reports
    const reports = await Report.insertMany([
      revenueReport,
      bookingsReport,
      equipmentReport
    ]);
    
    res.json(reports);
  } catch (error) {
    console.error('Error generating all reports:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper functions for report data
const getRevenueReportData = async (period) => {
  const startDate = getStartDate(period);
  const endDate = new Date();
  
  const bookings = await Booking.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  
  return {
    type: 'revenue',
    period,
    date: endDate,
    value: totalRevenue,
    metadata: {
      bookingCount: bookings.length,
      currency: 'GHS'
      }
  };
};

const getBookingsReportData = async (period) => {
  const startDate = getStartDate(period);
  const endDate = new Date();
  
  const bookingCount = await Booking.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  return {
    type: 'bookings',
    period,
    date: endDate,
    value: bookingCount,
    metadata: {}
  };
};

const getEquipmentUtilizationReportData = async (period) => {
  const products = await Product.find({});
  const totalProducts = products.length;
  
  if (totalProducts === 0) {
    return {
      type: 'equipment-utilization',
      period,
      date: new Date(),
      value: 0,
      metadata: {}
    };
  }
  
  // Count products in use
  const inUseProducts = products.filter(product => product.status === 'In Use').length;
  const utilization = Math.round((inUseProducts / totalProducts) * 100);
  
  return {
    type: 'equipment-utilization',
    period,
    date: new Date(),
    value: utilization,
    metadata: {
      totalProducts,
      inUseProducts
    }
  };
};

// Helper function to get start date based on period
const getStartDate = (period) => {
  const date = new Date();
  switch (period) {
    case 'daily':
      date.setDate(date.getDate() - 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setMonth(date.getMonth() - 1);
  }
  return date;
};