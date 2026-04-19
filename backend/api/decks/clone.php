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
include_once '../../config/jwt_helper.php';

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$decoded = JWT::validate(str_replace('Bearer ', '', $authHeader));

if (!$decoded) {
    http_response_code(401);
    exit();
}

$user_id = $decoded->id;

$data = json_decode(file_get_contents("php://input"));
if (empty($data->deck_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Thiếu mã bộ thẻ gốc"]);
    exit();
}

$original_deck_id = $data->deck_id;

$db = (new Database())->getConnection();

try {
    $db->beginTransaction();

    // 1. Kiểm tra bộ thẻ gốc có tồn tại và đang public không
    $stmt = $db->prepare("SELECT title, description FROM decks WHERE id = :id AND is_public = 1");
    $stmt->bindParam(':id', $original_deck_id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        throw new Exception("Không tìm thấy bộ thẻ hoặc nó không công khai.");
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $title = $row['title'];
    $description = $row['description'];

    // 2. Tạo bộ thẻ mới cho user (mặc định is_public = 0)
    $insertDeck = $db->prepare("INSERT INTO decks (user_id, title, description, is_public, created_at) VALUES (:user_id, :title, :description, 0, CURRENT_TIMESTAMP)");
    $insertDeck->bindParam(':user_id', $user_id);
    $insertDeck->bindParam(':title', $title);
    $insertDeck->bindParam(':description', $description);

    if (!$insertDeck->execute()) {
        throw new Exception("Không thể tạo bộ thẻ mới.");
    }

    $new_deck_id = $db->lastInsertId();

    // 3. Copy các thẻ từ bộ cũ sang bộ mới (CẬP NHẬT: THÊM 2 CỘT ẢNH)
    $insertCards = $db->prepare("
        INSERT INTO cards (deck_id, front_content, front_image_url, back_content, back_image_url, repetitions, ease_factor, review_interval, next_review_date, created_at)
        SELECT :new_deck_id, front_content, front_image_url, back_content, back_image_url, 0, 2.5, 0, CURRENT_DATE, CURRENT_TIMESTAMP
        FROM cards
        WHERE deck_id = :old_deck_id
    ");
    $insertCards->bindParam(':new_deck_id', $new_deck_id);
    $insertCards->bindParam(':old_deck_id', $original_deck_id);
    $insertCards->execute();

    $db->commit();

    http_response_code(201);
    echo json_encode(["message" => "Tải về thành công", "new_deck_id" => $new_deck_id]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(503);
    echo json_encode(["message" => $e->getMessage()]);
}
?>