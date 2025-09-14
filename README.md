# Bounce Kingdom Ghana - Backend

This directory contains all the backend code for the Bounce Kingdom Ghana application.

## Project Structure

```
backend/
├── server.js          # Main entry point
├── package.json       # Backend dependencies
├── .env.example       # Example environment variables
├── render.yaml        # Render.com deployment configuration
└── src/
    ├── controllers/   # Request handlers
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── config/        # Configuration files
    └── services/      # Business logic
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For production:
   ```bash
   npm start
   ```

## API Endpoints

- Products: `/api/products`
- Bookings: `/api/bookings`
- Reports: `/api/reports`
- Activities: `/api/activities`

## Database

The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running before starting the server.

## Deployment

The backend can be deployed to services like Render.com or Heroku:

1. Set environment variables on your deployment platform
2. Deploy the `backend/` directory
3. Ensure MongoDB connection is properly configured

### Render.com Deployment

1. Connect your GitHub repository to Render
2. Set the following environment variables in Render:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for token signing
   - `PORT`: 5001 (or let Render use its default)
3. Render will automatically use the `render.yaml` configuration file
4. The build command is `npm install` and start command is `node server.js`