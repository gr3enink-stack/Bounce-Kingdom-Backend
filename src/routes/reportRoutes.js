import express from 'express';
import {
  getReports,
  getRevenueReport,
  getBookingsReport,
  getEquipmentUtilizationReport,
  generateAllReports
} from '../controllers/reportController.js';

const router = express.Router();

router.route('/')
  .get(getReports);

router.route('/revenue')
  .get(getRevenueReport);

router.route('/bookings')
  .get(getBookingsReport);

router.route('/equipment-utilization')
  .get(getEquipmentUtilizationReport);

router.route('/generate')
  .post(generateAllReports);

export default router;