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

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['message' => 'No file uploaded or upload error']);
    exit();
}

$file = $_FILES['avatar'];
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
$max_size = 2 * 1024 * 1024;

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

// ====== CLOUDINARY CONFIG ======
$cloud_name = getenv('CLOUDINARY_CLOUD_NAME') ?: 'dtos8dxdw';
$api_key    = getenv('CLOUDINARY_API_KEY')    ?: '632292521579181';
$api_secret = getenv('CLOUDINARY_API_SECRET') ?: 'IVQKHZS7EJECsEW7xVCXYRFQixo';
// ================================

try {
    // Tạo chữ ký (signature) để upload lên Cloudinary
    $timestamp  = time();
    $public_id  = 'avatars/user_' . $user_data->id . '_' . $timestamp;
    $params_to_sign = "public_id={$public_id}&timestamp={$timestamp}";
    $signature  = sha1($params_to_sign . $api_secret);

    // Gửi file lên Cloudinary qua cURL
    $upload_url = "https://api.cloudinary.com/v1_1/{$cloud_name}/image/upload";

    $post_data = [
        'file'       => new CURLFile($file['tmp_name'], $file['type'], $file['name']),
        'api_key'    => $api_key,
        'timestamp'  => $timestamp,
        'public_id'  => $public_id,
        'signature'  => $signature,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $upload_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        http_response_code(500);
        echo json_encode(['message' => 'Cloudinary upload failed', 'detail' => $response]);
        exit();
    }

    $cloudinary_data = json_decode($response, true);
    $avatar_url = $cloudinary_data['secure_url'];

    // Lưu URL Cloudinary vào DB
    $db = (new Database())->getConnection();
    $stmt = $db->prepare("UPDATE users SET avatar = ? WHERE id = ?");
    $stmt->execute([$avatar_url, $user_data->id]);

    http_response_code(200);
    echo json_encode([
        'message' => 'Avatar uploaded successfully',
        'avatar'  => $avatar_url
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}