import User from '../models/User.js';

// Create a new user
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Update user
export const updateUser = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};