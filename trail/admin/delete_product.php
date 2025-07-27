<?php
// Include database connection
require_once 'db_connect.php';

// Set response header to JSON
header('Content-Type: application/json');

// Check if ID is provided
if (!isset($_POST['id']) || empty($_POST['id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Product ID is required'
    ]);
    exit;
}

try {
    $productId = $_POST['id'];
    
    // First, get the file path to delete the file
    $stmt = $pdo->prepare("SELECT image_path FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product) {
        throw new Exception('Product not found');
    }
    
    // Delete the file
    if (file_exists($product['image_path'])) {
        unlink($product['image_path']);
    }
    
    // Delete from database
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Product deleted successfully'
    ]);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>