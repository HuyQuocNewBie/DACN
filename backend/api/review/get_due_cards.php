<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
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
    exit();
}

$db = (new Database())->getConnection();
$deck_id = isset($_GET['deck_id']) ? $_GET['deck_id'] : null;

if ($deck_id) {
    $query = "SELECT c.id, c.front_content, c.back_content, 
                     c.repetitions, c.review_interval, c.ease_factor
              FROM cards c
              JOIN decks d ON c.deck_id = d.id
              WHERE c.deck_id = :deck_id 
                AND d.user_id = :user_id 
                AND c.next_review_date <= CURRENT_DATE
              ORDER BY c.next_review_date ASC, c.id ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":deck_id", $deck_id);
    $stmt->bindParam(":user_id", $user_data->id);
} else {
    $query = "SELECT c.id, c.front_content, c.back_content, 
                     c.repetitions, c.review_interval, c.ease_factor 
              FROM cards c
              JOIN decks d ON c.deck_id = d.id
              WHERE d.user_id = :user_id 
                AND c.next_review_date <= CURRENT_DATE
              ORDER BY c.next_review_date ASC, c.id ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_data->id);
}
$stmt->execute();

$cards_arr = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['repetitions'] = (int) $row['repetitions'];
    $row['review_interval'] = (int) $row['review_interval'];
    $row['ease_factor'] = (float) $row['ease_factor'];

    array_push($cards_arr, $row);
}

http_response_code(200);
echo json_encode($cards_arr);
?>