<?php
// Include database connection
require_once 'admin/db_connect.php';

// Set response header to JSON
header('Content-Type: application/json');

try {
    // Get videos marked for courses
    $videoStmt = $pdo->query("SELECT * FROM videos WHERE add_to_course = 1 ORDER BY created_at DESC");
    $videos = $videoStmt->fetchAll();
    
    // Get products marked for courses
    $productStmt = $pdo->query("SELECT * FROM products WHERE add_to_course = 1 ORDER BY created_at DESC");
    $products = $productStmt->fetchAll();
    
    // Add type indicator to each item
    foreach ($videos as &$video) {
        $video['type'] = 'video';
    }
    
    foreach ($products as &$product) {
        $product['type'] = 'product';
    }
    
    // Combine videos and products
    $courses = array_merge($videos, $products);
    
    // Return courses as JSON
    echo json_encode($courses);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>