<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Kiểm tra file upload
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['message' => 'No file uploaded or upload error']);
    exit();
}

$file = $_FILES['avatar'];
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
$max_size = 2 * 1024 * 1024; // 2MB

// Validation
if (!in_array($file['type'], $allowed_types)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid file type. Only JPEG and PNG allowed']);
    exit();
}

if ($file['size'] > $max_size) {
    http_response_code(400);
    echo json_encode(['message' => 'File too large. Maximum 2MB allowed']);
    exit();
}

try {
    // Tạo thư mục uploads nếu chưa có
    $uploads_dir = '../../uploads/avatars';
    if (!is_dir($uploads_dir)) {
        mkdir($uploads_dir, 0755, true);
    }

    // Tạo tên file unique
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $user_data->id . '_' . time() . '.' . $extension;
    $filepath = $uploads_dir . '/' . $filename;

    // Move file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to save file']);
        exit();
    }

    // Lưu path vào database
    $db = (new Database())->getConnection();
    $stmt = $db->prepare("UPDATE users SET avatar = ? WHERE id = ?");
    $avatar_path = 'uploads/avatars/' . $filename;
    $stmt->execute([$avatar_path, $user_data->id]);

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $avatar_url = $protocol . '://' . $host . '/' . $avatar_path;

    http_response_code(200);
    echo json_encode([
        'message' => 'Avatar uploaded successfully',
        'avatar' => $avatar_url
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
