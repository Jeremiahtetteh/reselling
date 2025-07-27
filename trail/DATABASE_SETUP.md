# Database Setup for MathCenter Website

This guide will help you set up the MySQL database for the MathCenter website.

## Prerequisites

1. MySQL Server (or MariaDB)
2. PHP with PDO extension enabled
3. Web server (Apache, Nginx, etc.)

## Setup Steps

### 1. Create the Database

You can create the database using phpMyAdmin or the MySQL command line:

```sql
CREATE DATABASE mathcenter;
```

### 2. Create Tables

Run the SQL script in `admin/setup_database.sql` to create the necessary tables:

```sql
-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    duration VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255) NOT NULL,
    add_to_course BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    add_to_course BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configure Database Connection

Edit the `admin/db_connect.php` file with your database credentials:

```php
<?php
// Database connection parameters
$host = 'localhost';     // Your database host
$dbname = 'mathcenter';  // Your database name
$username = 'root';      // Your database username
$password = '';          // Your database password

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    // Set error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // If connection fails, return error
    die("Database connection failed: " . $e->getMessage());
}
?>
```

### 4. Create Uploads Directory

Make sure the `uploads` directory exists and is writable:

```bash
mkdir -p uploads
chmod 777 uploads
```

## Testing the Setup

1. Navigate to the admin panel at `/admin/login.html`
2. Login with username: `admin` and password: `password123`
3. Try adding a video or product
4. Check if the files are uploaded to the `uploads` directory
5. Verify that the data is stored in the database

## Troubleshooting

### File Upload Issues

- Check if the `uploads` directory exists and has write permissions
- Check PHP file upload limits in `php.ini` (upload_max_filesize, post_max_size)

### Database Connection Issues

- Verify database credentials in `admin/db_connect.php`
- Make sure the MySQL server is running
- Check if the database and tables exist

### PHP Errors

- Enable PHP error reporting for debugging:

```php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```
