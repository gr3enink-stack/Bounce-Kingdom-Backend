import Activity from '../models/Activity.js';

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Private/Admin
export const getActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const activities = await Activity.find({}).sort({ timestamp: -1 }).limit(parseInt(limit));
    
    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      action: activity.action,
      user: activity.user,
      time: getTimeAgo(activity.timestamp),
      timestamp: activity.timestamp
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Private/Admin
export const createActivity = async (req, res) => {
  try {
    const { action, user, details, ipAddress, userAgent } = req.body;
    
    // Validate required fields
    if (!action || !user) {
      return res.status(400).json({ message: 'Action and user are required' });
    }
    
    // Create activity
    const activity = new Activity({
      action,
      user,
      details,
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('User-Agent')
    });
    
    const createdActivity = await activity.save();
    
    // Format for response
    const formattedActivity = {
      id: createdActivity._id,
      action: createdActivity.action,
      user: createdActivity.user,
      time: getTimeAgo(createdActivity.timestamp),
      timestamp: createdActivity.timestamp
    };
    
    res.status(201).json(formattedActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private/Admin
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (activity) {
      // Format for response
      const formattedActivity = {
        id: activity._id,
        action: activity.action,
        user: activity.user,
        time: getTimeAgo(activity.timestamp),
        timestamp: activity.timestamp,
        details: activity.details,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent
      };
      
      res.json(formattedActivity);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to convert timestamp to "time ago" format
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const diffMs = now - new Date(timestamp);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHrs > 0) {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
};