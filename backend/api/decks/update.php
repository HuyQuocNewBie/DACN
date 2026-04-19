<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Deck.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401); exit();
}

$db = (new Database())->getConnection();
$deck = new Deck($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->title)) {
    $deck->id = $data->id;
    $deck->title = $data->title;
    $deck->description = isset($data->description) ? $data->description : "";
    $deck->is_public = isset($data->is_public) ? (int)$data->is_public : 0;
    
    $deck->user_id = $user_data->id;

    if ($deck->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Cập nhật bộ thẻ thành công."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Không thể cập nhật bộ thẻ."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dữ liệu không đầy đủ. Mất ID hoặc Tiêu đề."));
}
?>
