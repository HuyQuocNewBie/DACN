<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/Card.php';
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data) {
    http_response_code(401);
    exit();
}

$db = (new Database())->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->card_id) && isset($data->quality)) {
    $query = "SELECT repetitions, ease_factor, review_interval FROM cards WHERE id = :card_id LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":card_id", $data->card_id);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(["message" => "Thẻ không tồn tại"]);
        exit();
    }
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $repetitions = $row['repetitions'];
    $ease_factor = $row['ease_factor'];
    $review_interval = $row['review_interval'];

    $quality = $data->quality;

    if ($quality < 3) {
        $repetitions = 0;
        $review_interval = 1;
    } else {
        $repetitions += 1;
        if ($repetitions == 1) {
            $review_interval = 1;
        } else if ($repetitions == 2) {
            $review_interval = 6;
        } else {
            $review_interval = round($review_interval * $ease_factor);
        }
    }

    $ease_factor = $ease_factor + (0.1 - (5 - $quality) * (0.08 + (5 - $quality) * 0.02));
    if ($ease_factor < 1.3) $ease_factor = 1.3;

    $next_review_date = date('Y-m-d', strtotime("+$review_interval days"));

    $card = new Card($db);
    $card->id = $data->card_id;
    $card->repetitions = $repetitions;
    $card->ease_factor = $ease_factor;
    $card->review_interval = $review_interval;
    $card->next_review_date = $next_review_date;

    if ($card->updateSM2Progress()) {
        $log_query = "INSERT INTO review_logs SET user_id=:u, card_id=:c, quality=:q";
        $log_stmt = $db->prepare($log_query);
        $log_stmt->bindParam(":u", $user_data->id);
        $log_stmt->bindParam(":c", $data->card_id);
        $log_stmt->bindParam(":q", $quality);
        $log_stmt->execute();
        http_response_code(200);
        echo json_encode(["message" => "Nã Đạn Trí Nhớ thành công.", "next_review_date" => $next_review_date]);
    }
} else {
    http_response_code(503);
    echo json_encode(["message" => "Lỗi ghi nhận dòng máu kỹ thuật số."]);
}
