<?php
// Include database connection
require_once 'admin/db_connect.php';

// Set response header to JSON
header('Content-Type: application/json');

try {
    // Query to get all products
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
    $products = $stmt->fetchAll();
    
    // Return products as JSON
    echo json_encode($products);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>