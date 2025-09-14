import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from './userService.js';

// Login function
export const login = async (username, password) => {
  try {
    // Get user by username
    const user = await getUserByUsername(username);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    throw new Error(`Error during login: ${error.message}`);
  }
};

// Register function
export const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(userData.username);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user with hashed password
    const user = {
      ...userData,
      password: hashedPassword
    };
    
    // Save user
    const savedUser = await createUser(user);
    
    // Create token
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return {
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role
      }
    };
  } catch (error) {
    throw new Error(`Error during registration: ${error.message}`);
  }
};

// Create user function (imported from userService)
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};