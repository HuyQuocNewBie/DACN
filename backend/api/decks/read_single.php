<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
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

$deck->id = isset($_GET['id']) ? $_GET['id'] : die();

$stmt = $deck->readSingle();
$num = $stmt->rowCount();

if ($num > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Kiểm tra quyền: Chỉ cho hiển thị nếu là public hoặc của chính user đó. 
    // Tuy nhiên màn DeckDetail chủ yếu gọi API này cho bộ thẻ riêng, ta sẽ cho phép xem nếu thoả mãn: 
    if ($row['is_public'] == 1 || $row['user_id'] == $user_data->id || $user_data->role == 'admin') {
        $deck_arr = array(
            "id" =>  $row['id'],
            "title" => $row['title'],
            "description" => $row['description'],
            "is_public" => (bool)$row['is_public'],
            "cards_count" => $row['cards_count']
        );
        http_response_code(200);
        echo json_encode($deck_arr);
    } else {
        http_response_code(403);
        echo json_encode(array("message" => "Bạn không có quyền truy cập bộ thẻ này."));
    }
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Bộ thẻ không tồn tại."));
}
?>
