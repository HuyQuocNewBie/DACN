<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Card.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401); exit();
}

$db = (new Database())->getConnection();
$card = new Card($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->deck_id) && !empty($data->front_content) && !empty($data->back_content)) {
    $card->deck_id = $data->deck_id;
    $card->front_content = $data->front_content;
    $card->back_content = $data->back_content;
    $card->image_url = isset($data->image_url) ? $data->image_url : null;
    
    if ($card->create()) {
        http_response_code(201);
        echo json_encode(["message" => "Đã tạo xong lá cờ nhớ mới."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Nghẽn mạng khi đúc thẻ."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Thiếu nội dung mặt trước hoặc mặt sau."]);
}
?>
