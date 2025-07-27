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
if (!isset($_POST['name']) || !isset($_POST['category']) || !isset($_POST['description']) || !isset($_POST['price'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields'
    ]);
    exit;
}

// Check if image file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'error' => 'Product image is required'
    ]);
    exit;
}

try {
    // Get form data
    $name = $_POST['name'];
    $category = $_POST['category'];
    $description = $_POST['description'];
    $price = floatval($_POST['price']);
    $addToCourse = isset($_POST['addToCourse']) && $_POST['addToCourse'] === 'true' ? 1 : 0;
    
    // Process image file
    $imageTempFile = $_FILES['image']['tmp_name'];
    $imageFileName = time() . '_' . basename($_FILES['image']['name']);
    $imageTargetFile = $uploadDir . $imageFileName;
    
    // Move uploaded file
    if (!move_uploaded_file($imageTempFile, $imageTargetFile)) {
        throw new Exception('Failed to move image file');
    }
    
    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO products (name, description, category, price, image_path, add_to_course) 
                          VALUES (?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $name,
        $description,
        $category,
        $price,
        $imageTargetFile,
        $addToCourse
    ]);
    
    $productId = $pdo->lastInsertId();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'id' => $productId,
        'name' => $name,
        'imagePath' => $imageTargetFile
    ]);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>