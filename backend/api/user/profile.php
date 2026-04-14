<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

try {
    $stmt = $db->prepare("SELECT username, email, role FROM users WHERE id = ?");
    $stmt->execute([$uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        http_response_code(200);
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error']);
}
