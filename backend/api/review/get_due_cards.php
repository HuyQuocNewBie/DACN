<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
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
$deck_id = isset($_GET['deck_id']) ? $_GET['deck_id'] : die(json_encode(["message"=>"Thiếu id bộ thẻ"]));

// Thuật toán quét và rà soát siêu tốc những Thẻ đã 'Đáo hạn' ôn tập (Ngày ôn tập <= Hôm nay)
$query = "SELECT id, front_content, back_content, image_url 
          FROM cards 
          WHERE deck_id = :deck_id AND next_review_date <= CURRENT_DATE
          ORDER BY next_review_date ASC, id ASC";

$stmt = $db->prepare($query);
$stmt->bindParam(":deck_id", $deck_id);
$stmt->execute();

$cards_arr = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($cards_arr, $row);
}
http_response_code(200);
echo json_encode($cards_arr);
?>
