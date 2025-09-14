import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Create a new product
export const createProduct = async (productData) => {
  try {
    console.log('Product data type:', typeof productData);
    console.log('Product data constructor:', productData.constructor.name);
    
    // Validate that we have the required fields
    if (!productData.name || !productData.description || !productData.category) {
      throw new Error('Missing required fields: name, description, and category are required');
    }
    
    // Create a new Product instance from the provided data
    const product = new Product(productData);
    console.log('Product instance created:', product);
    console.log('Product instance type:', typeof product);
    console.log('Product constructor:', product.constructor.name);
    console.log('Product has save method:', typeof product.save);
    
    // Check if product has save method before calling it
    if (typeof product.save !== 'function') {
      // Try alternative approach using Product.create
      console.log('Using Product.create instead of new Product() + save()');
      const savedProduct = await Product.create(productData);
      console.log('Product created successfully:', savedProduct.name);
      return savedProduct;
    }
    
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct.name);
    return savedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation error: ${validationErrors.join(', ')}`);
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      throw new Error(`Database error: ${error.message}`);
    } else if (error.name === 'BSONError') {
      throw new Error('Image data is too large. Please use a smaller image.');
    } else {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(id) });
    }
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error(`Error fetching product: ${error.message}`);
  }
};

// Update product
export const updateProduct = async (id, updateData) => {
  try {
    console.log('Updating product with data:', updateData);
    console.log('Product ID:', id);
    
    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(id) });
    }
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Update product fields
    Object.keys(updateData).forEach(key => {
      product[key] = updateData[key];
    });
    
    const updatedProduct = await product.save();
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    console.error('Error name:', error.name);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation error: ${validationErrors.join(', ')}`);
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      throw new Error(`Database error: ${error.message}`);
    } else if (error.name === 'BSONError') {
      throw new Error('Image data is too large. Please use a smaller image.');
    } else if (error.name === 'CastError') {
      throw new Error(`Invalid product ID format: ${error.message}`);
    } else {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    console.log('Deleting product with ID:', id);
    
    // Try to find product by MongoDB ObjectId first, then by productId
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by _id
      product = await Product.findById(id);
    } else {
      // Otherwise, search by productId (numeric ID)
      product = await Product.findOne({ productId: parseInt(id) });
    }
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    await product.remove();
    return product;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error(`Error deleting product: ${error.message}`);
  }
};