<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Deck.php';
include_once '../../config/jwt_helper.php';

// Bảo mật API (Bắt Authorization Token từ Frontend)
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401);
    echo json_encode(["message" => "Truy cập từ chối. Token vắng mặt hoặc mạo danh."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$deck = new Deck($db);

// Chỉ Đọc bộ thẻ của ông chủ tài khoản đang đăng nhập
$deck->user_id = $user_data->id;

$stmt = $deck->readByUser();
$num = $stmt->rowCount();

if ($num > 0) {
    $decks_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $deck_item = array(
            "id" => $id,
            "title" => $title,
            "description" => $description,
            "is_public" => $is_public,

            "cards_count" => $cards_count,
            "created_at" => $created_at
        );
        array_push($decks_arr, $deck_item);
    }
    http_response_code(200);
    echo json_encode($decks_arr);
} else {
    // Không có gì thì trả mảng rỗng [] cho React map không bị Crash Array null
    http_response_code(200); 
    echo json_encode(array());
}
?>
