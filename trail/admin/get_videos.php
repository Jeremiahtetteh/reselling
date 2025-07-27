<?php
// Include database connection
require_once 'db_connect.php';

// Set response header to JSON
header('Content-Type: application/json');

try {
    // Query to get all videos
    $stmt = $pdo->query("SELECT * FROM videos ORDER BY created_at DESC");
    $videos = $stmt->fetchAll();
    
    // Return videos as JSON
    echo json_encode($videos);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>