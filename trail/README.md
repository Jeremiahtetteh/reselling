# MathCenter Website with MongoDB Atlas

This website uses MongoDB Atlas to store video information and references, allowing you to upload and play videos of virtually any size.

## Quick Start

1. **Install Dependencies**

   ```
   npm install
   ```

2. **Test Database Connection**

   - Double-click `test-db.bat` to verify MongoDB Atlas connection

3. **Start the Server**

   - Double-click `start-server.bat` to run the server
   - Server will run at http://localhost:3000

4. **Access the Website**
   - Open `index.html` in your browser
   - Admin panel is at `admin/login.html` (username: admin, password: password123)

## Features

- **Large Video Support**: Upload videos of any size
- **Cloud Database**: Video metadata stored in MongoDB Atlas
- **Admin Panel**: Easy-to-use interface for managing videos and products
- **Courses Page**: Display videos and products marked as courses

## File Structure

- `server.js` - Main server file
- `uploads/` - Directory for uploaded files
- `admin/` - Admin panel files
- `js/` - JavaScript files for the website

## MongoDB Atlas Connection

The server is configured to connect to your MongoDB Atlas cluster:

```
mongodb+srv://jeremiahtetteh2008:Jeremiah2008@cluster0.8yezoph.mongodb.net/mathcenter
```

## Troubleshooting

If you encounter issues:

1. **Server Won't Start**

   - Make sure Node.js is installed
   - Check if port 3000 is available
   - Run `npm install` to install dependencies

2. **Database Connection Issues**

   - Run `test-db.bat` to check connection
   - Verify internet connection
   - Check MongoDB Atlas status

3. **Video Upload Problems**
   - Check if the uploads directory exists
   - Verify server is running
   - Check browser console for errors
