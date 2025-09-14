import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Default products data
const defaultProducts = [
  {
    productId: 1,
    name: "The Pirate Ship Bounce House",
    description: "Ahoy mateys! Set sail for adventure with our pirate-themed bounce house complete with slides and climbing areas.",
    image: "/images/pirate-ship.jpg",
    specs: {
      dimensions: "15' x 15'",
      ageGroup: "3-10 years",
      capacity: "8-10 kids"
    },
    category: "Bounce House",
    status: "Available",
    lastMaintenance: new Date()
  },
  {
    productId: 2,
    name: "Tropical Thunder Water Slide",
    description: "Cool off with our tropical-themed water slide that will make a splash at any party!",
    image: "/images/water-slide.jpg",
    specs: {
      dimensions: "20' x 10'",
      ageGroup: "5-12 years",
      capacity: "4-6 kids"
    },
    category: "Water Slide",
    status: "In Use",
    lastMaintenance: new Date()
  },
  {
    productId: 3,
    name: "Rainbow Balloon Pit",
    description: "Dive into a sea of colorful balloons in our magical rainbow balloon pit.",
    image: "/images/balloon-pit.jpg",
    specs: {
      dimensions: "12' x 12'",
      ageGroup: "2-8 years",
      capacity: "6-8 kids"
    },
    category: "Balloon Pit",
    status: "Available",
    lastMaintenance: new Date()
  },
  {
    productId: 4,
    name: "Castle Adventure Combo",
    description: "Our most popular combo unit with a bounce area, slide, and climbing wall.",
    image: "/images/castle-combo.jpg",
    specs: {
      dimensions: "18' x 18'",
      ageGroup: "3-12 years",
      capacity: "10-12 kids"
    },
    category: "Combo Unit",
    status: "Maintenance",
    lastMaintenance: new Date()
  }
];

// Create default admin user
const createDefaultAdmin = async () => {
  const adminExists = await User.findOne({ username: 'admin' });
  
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@bouncekingdom.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Default admin user created: admin / admin123');
  }
};

// Initialize products
const initializeProducts = async () => {
  const count = await Product.countDocuments();
  
  if (count === 0) {
    await Product.insertMany(defaultProducts);
    console.log('Default products initialized');
  }
};

// Initialize database with default data
export const initializeDatabase = async () => {
  try {
    await createDefaultAdmin();
    await initializeProducts();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};