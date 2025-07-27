# MathCenter Website - Node.js Backend Setup

This guide will help you set up the Node.js backend for the MathCenter website.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local installation or MongoDB Atlas)
3. npm (Node Package Manager)

## Setup Steps

### 1. Install Node.js

If you haven't already installed Node.js:
- Go to https://nodejs.org
- Download and install the LTS version
- Verify installation by running `node -v` and `npm -v` in your terminal

### 2. Install MongoDB

#### Option 1: Local MongoDB Installation
- Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Start the MongoDB service

#### Option 2: MongoDB Atlas (Cloud)
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string

### 3. Install Dependencies

In the project directory, run:

```bash
npm install
```

This will install all required dependencies listed in package.json.

### 4. MongoDB Connection

The server is already configured to use your MongoDB Atlas cluster:

```javascript
// MongoDB Atlas connection
mongoose.connect('mongodb+srv://jeremiahtetteh2008:Jeremiah2008@cluster0.8yezoph.mongodb.net/mathcenter', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

No changes are needed to the connection string.

### 5. Start the Server

Run the following command to start the server:

```bash
npm start
```

The server will start on http://localhost:3000.

## API Endpoints

### Videos

- **GET /api/videos** - Get all videos
- **POST /api/videos** - Add a new video
- **DELETE /api/videos/:id** - Delete a video

### Products

- **GET /api/products** - Get all products
- **POST /api/products** - Add a new product
- **DELETE /api/products/:id** - Delete a product

### Courses

- **GET /api/courses** - Get all items marked for courses

## File Structure

- `server.js` - Main server file
- `uploads/` - Directory for uploaded files
- `package.json` - Project dependencies

## Troubleshooting

### Server Won't Start

- Check if MongoDB is running
- Verify the connection string
- Make sure the required ports are available

### Upload Issues

- Check if the uploads directory exists and is writable
- Verify that the form is sending the correct data
- Check the file size limits in your browser

### MongoDB Connection Issues

- Verify your MongoDB credentials
- Check network connectivity
- Ensure MongoDB service is running

## Next Steps

1. Add user authentication
2. Implement payment processing
3. Add analytics tracking
4. Set up automated backups