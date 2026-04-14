<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

// Kiểm tra quyền Admin
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data || ($user_data->role ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit();
}

$db = (new Database())->getConnection();

try {
    // Đếm tổng số user
    $totalUsers = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();

    // Đếm tổng số bộ thẻ (Decks)
    $totalDecks = $db->query("SELECT COUNT(*) FROM decks")->fetchColumn();

    // Đếm tổng số thẻ (Cards)
    $totalCards = $db->query("SELECT COUNT(*) FROM cards")->fetchColumn();

    // Lấy số bộ thẻ được tạo trong hôm nay (Ví dụ thêm)
    $decksToday = $db->query("SELECT COUNT(*) FROM decks WHERE DATE(created_at) = CURRENT_DATE")->fetchColumn();

    echo json_encode([
        "totalUsers" => (int)$totalUsers,
        "totalDecks" => (int)$totalDecks,
        "totalCards" => (int)$totalCards,
        "activeToday" => (int)$decksToday // Tạm thời dùng số bộ thẻ mới thay cho 'Online'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Lỗi server: " . $e->getMessage()]);
}