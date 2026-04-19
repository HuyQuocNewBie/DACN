<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

include_once '../../config/database.php';
include_once '../../models/Card.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
if (!JWT::validate($jwt)) {
    http_response_code(401); exit();
}

$db = (new Database())->getConnection();
$card = new Card($db);

$deck_id = isset($_GET['deck_id']) ? $_GET['deck_id'] : die(json_encode(["message"=>"Thiếu id bộ thẻ"]));

$stmt = $card->readByDeck($deck_id);
$num = $stmt->rowCount();

if ($num > 0) {
    $cards_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Sau khi update Model, $row sẽ chứa:
        // 'front_image_url' và 'back_image_url'
        array_push($cards_arr, $row);
    }
    http_response_code(200); 
    echo json_encode($cards_arr);
} else {
    http_response_code(200); 
    echo json_encode(array()); 
}
?>