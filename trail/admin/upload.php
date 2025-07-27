<?php
// Include database connection
require_once 'db_connect.php';

// Set the upload directory
$uploadDir = '../uploads/';

// Create the directory if it doesn't exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Set response header to JSON
header('Content-Type: application/json');

// Check if all required fields are present
if (!isset($_POST['title']) || !isset($_POST['category']) || !isset($_POST['description']) || 
    !isset($_POST['duration']) || !isset($_POST['price'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields'
    ]);
    exit;
}

// Check if both files were uploaded
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK || 
    !isset($_FILES['thumbnail']) || $_FILES['thumbnail']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'error' => 'Video and thumbnail files are required'
    ]);
    exit;
}

try {
    // Get form data
    $title = $_POST['title'];
    $category = $_POST['category'];
    $description = $_POST['description'];
    $duration = $_POST['duration'];
    $price = floatval($_POST['price']);
    $addToCourse = isset($_POST['addToCourse']) && $_POST['addToCourse'] === 'true' ? 1 : 0;
    
    // Process video file
    $videoTempFile = $_FILES['video']['tmp_name'];
    $videoFileName = time() . '_' . basename($_FILES['video']['name']);
    $videoTargetFile = $uploadDir . $videoFileName;
    
    // Process thumbnail file
    $thumbnailTempFile = $_FILES['thumbnail']['tmp_name'];
    $thumbnailFileName = time() . '_thumb_' . basename($_FILES['thumbnail']['name']);
    $thumbnailTargetFile = $uploadDir . $thumbnailFileName;
    
    // Move uploaded files
    if (!move_uploaded_file($videoTempFile, $videoTargetFile)) {
        throw new Exception('Failed to move video file');
    }
    
    if (!move_uploaded_file($thumbnailTempFile, $thumbnailTargetFile)) {
        // Clean up video file if thumbnail upload fails
        unlink($videoTargetFile);
        throw new Exception('Failed to move thumbnail file');
    }
    
    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO videos (title, description, category, duration, price, file_path, thumbnail_path, add_to_course) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $title,
        $description,
        $category,
        $duration,
        $price,
        $videoTargetFile,
        $thumbnailTargetFile,
        $addToCourse
    ]);
    
    $videoId = $pdo->lastInsertId();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'id' => $videoId,
        'title' => $title,
        'videoPath' => $videoTargetFile,
        'thumbnailPath' => $thumbnailTargetFile
    ]);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>