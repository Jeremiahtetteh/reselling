<?php
// Include database connection
require_once 'db_connect.php';

// Set response header to JSON
header('Content-Type: application/json');

// Check if ID is provided
if (!isset($_POST['id']) || empty($_POST['id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Video ID is required'
    ]);
    exit;
}

try {
    $videoId = $_POST['id'];
    
    // First, get the file paths to delete the files
    $stmt = $pdo->prepare("SELECT file_path, thumbnail_path FROM videos WHERE id = ?");
    $stmt->execute([$videoId]);
    $video = $stmt->fetch();
    
    if (!$video) {
        throw new Exception('Video not found');
    }
    
    // Delete the files
    if (file_exists($video['file_path'])) {
        unlink($video['file_path']);
    }
    
    if (file_exists($video['thumbnail_path'])) {
        unlink($video['thumbnail_path']);
    }
    
    // Delete from database
    $stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
    $stmt->execute([$videoId]);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Video deleted successfully'
    ]);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>