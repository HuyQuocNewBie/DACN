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

$db = (new Database())->getConnection();
$deck = new Deck($db);

$stmt = $deck->readPublic();
$num = $stmt->rowCount();

if ($num > 0) {
    $decks_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($decks_arr, $row);
    }
    http_response_code(200);
    echo json_encode($decks_arr);
} else {
    http_response_code(200);
    echo json_encode(array());
}
?>
