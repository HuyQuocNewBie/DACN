<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (!JWT::validate(str_replace('Bearer ', '', $authHeader))) {
    http_response_code(401); exit();
}

$db = (new Database())->getConnection();
$data = json_decode(file_get_contents("php://input"));
$id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message"=>"Thiếu id"]));

if (!empty($data->front_content) && !empty($data->back_content)) {
    $query = "UPDATE cards SET front_content = :front_content, back_content = :back_content WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $front = htmlspecialchars(strip_tags($data->front_content));
    $back = htmlspecialchars(strip_tags($data->back_content));
    
    $stmt->bindParam(":front_content", $front);
    $stmt->bindParam(":back_content", $back);
    $stmt->bindParam(":id", $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Cập nhật thành công"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Lỗi cập nhật thẻ"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Thiếu nội dung mặt trước hoặc sau"]);
}
?>
