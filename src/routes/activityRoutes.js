import express from 'express';
import {
  getActivities,
  createActivity,
  getActivityById
} from '../controllers/activityController.js';

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(createActivity);

router.route('/:id')
  .get(getActivityById);

export default router;