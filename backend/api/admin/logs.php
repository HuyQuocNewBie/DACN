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
include_once '../../models/ReviewLog.php'; 

// AUTH ADMIN
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data || ($user_data->role ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$reviewLog = new ReviewLog($db);

try {
    $stmt = $reviewLog->readRecent();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($logs as &$log) {
        $log['id'] = (int)$log['id'];
        $log['quality'] = (int)$log['quality'];
    }

    http_response_code(200);
    echo json_encode($logs);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Lỗi: ' . $e->getMessage()]);
}
?>