import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(req.params.id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(req.params.id) });
    }
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      image,
      specs,
      additionalSpecs,
      category,
      status,
      lastMaintenance
    } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    // Create product
    const product = new Product({
      productId: productId || Math.floor(1000 + Math.random() * 9000),
      name,
      description,
      image: image || '',
      specs: specs || {},
      additionalSpecs: additionalSpecs || '',
      category,
      status: status || 'Available',
      lastMaintenance: lastMaintenance || new Date()
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: `Validation error: ${validationErrors.join(', ')}` });
    } else if (error.name === 'BSONError') {
      return res.status(400).json({ message: 'Invalid data format. Image data may be too large.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    console.log('Updating product with ID:', req.params.id);
    console.log('Request body:', req.body);
    
    // Validate that we have a valid product ID
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Invalid product ID provided for update' });
    }
    
    const {
      productId,
      name,
      description,
      image,
      specs,
      additionalSpecs,
      category,
      status,
      lastMaintenance
    } = req.body;

    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(req.params.id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(req.params.id) });
    }
    
    console.log('Found product:', product ? 'Yes' : 'No');

    if (product) {
      // Log image data size if present
      if (image) {
        console.log('Image data size:', image.length, 'characters');
      }

      product.productId = productId || product.productId;
      product.name = name || product.name;
      product.description = description || product.description;
      product.image = image || product.image;
      product.specs = specs || product.specs;
      product.additionalSpecs = additionalSpecs || product.additionalSpecs;
      product.category = category || product.category;
      product.status = status || product.status;
      product.lastMaintenance = lastMaintenance || product.lastMaintenance;

      console.log('Saving updated product...');
      const updatedProduct = await product.save();
      console.log('Product updated successfully:', updatedProduct._id);
      res.json(updatedProduct);
    } else {
      console.log('Product not found with ID:', req.params.id);
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: `Validation error: ${validationErrors.join(', ')}` });
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      return res.status(500).json({ message: `Database error: ${error.message}` });
    } else if (error.name === 'BSONError') {
      return res.status(400).json({ message: 'Invalid data format. Image data may be too large.' });
    } else if (error.name === 'RangeError') {
      return res.status(400).json({ message: 'Data too large for database. Try reducing image size.' });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid product ID format: ${error.message}` });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(req.params.id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(req.params.id) });
    }

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};