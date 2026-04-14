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

$db = (new Database())->getConnection();
$uid = $user_data->id;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$username = isset($data['username']) ? trim($data['username']) : null;
$password = isset($data['password']) ? $data['password'] : null;

if (!$username && !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'No data to update']);
    exit();
}

try {
    // Check if username is provided and not taken by another user
    if ($username) {
        $stmt = $db->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->execute([$username, $uid]);
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['message' => 'Username already taken']);
            exit();
        }
    }

    // Update user
    $updateFields = [];
    $params = [];
    if ($username) {
        $updateFields[] = "username = ?";
        $params[] = $username;
    }
    if ($password) {
        $updateFields[] = "password_hash = ?";
        $params[] = password_hash($password, PASSWORD_DEFAULT);
    }
    $params[] = $uid;

    $query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    http_response_code(200);
    echo json_encode(['message' => 'Profile updated successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error']);
}
