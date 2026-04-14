<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý request OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

// 1. Kiểm tra Token và Quyền Admin
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
$jwt = str_replace('Bearer ', '', $authHeader);
$user_data = JWT::validate($jwt);

if (!$user_data || ($user_data->role ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Bạn không có quyền truy cập']);
    exit();
}

// 2. Kết nối Database
$db = (new Database())->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Lấy ID từ query (?id=...)
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

/* =========================
   GET: LIST hoặc DETAIL
========================= */
if ($method === 'GET') {
    try {
        if ($id) {
            // 🔍 Lấy chi tiết 1 deck + cards
            $stmt = $db->prepare("
                SELECT d.*, u.username as creator 
                FROM decks d
                LEFT JOIN users u ON d.user_id = u.id
                WHERE d.id = ?
            ");
            $stmt->execute([$id]);
            $deck = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$deck) {
                http_response_code(404);
                echo json_encode(['message' => 'Không tìm thấy bộ thẻ']);
                exit();
            }

            // Lấy cards
            $stmtCards = $db->prepare("
    SELECT id, front_content, back_content 
    FROM cards 
    WHERE deck_id = ?
");
$stmtCards->execute([$id]);
$deck['cards'] = $stmtCards->fetchAll(PDO::FETCH_ASSOC);

            // Cast kiểu dữ liệu
            $deck['id'] = (int)$deck['id'];
            $deck['is_public'] = (bool)$deck['is_public'];

            http_response_code(200);
            echo json_encode($deck);
        } else {
            // 📋 Lấy danh sách decks
            $query = "SELECT 
                        d.id, 
                        d.title, 
                        d.description, 
                        d.is_public, 
                        d.created_at, 
                        u.username as creator,
                        (SELECT COUNT(*) FROM cards WHERE deck_id = d.id) as cards_count
                      FROM decks d
                      LEFT JOIN users u ON d.user_id = u.id
                      ORDER BY d.id DESC";

            $stmt = $db->prepare($query);
            $stmt->execute();
            $decks = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($decks as &$deck) {
                $deck['id'] = (int)$deck['id'];
                $deck['is_public'] = (bool)$deck['is_public'];
                $deck['cards_count'] = (int)$deck['cards_count'];
            }

            http_response_code(200);
            echo json_encode($decks);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Lỗi server: ' . $e->getMessage()]);
    }
}

/* =========================
   PUT: KHÓA / MỞ KHÓA
========================= */
elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->id) || !isset($data->is_public)) {
        http_response_code(400);
        echo json_encode(['message' => 'Thiếu dữ liệu']);
        exit();
    }

    try {
        $stmt = $db->prepare("UPDATE decks SET is_public = ? WHERE id = ?");
        if ($stmt->execute([(int)$data->is_public, (int)$data->id])) {
            http_response_code(200);
            echo json_encode(['message' => 'Cập nhật trạng thái thành công']);
        } else {
            throw new Exception("Không thể cập nhật");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Lỗi: ' . $e->getMessage()]);
    }
}

/* =========================
   DELETE: XÓA DECK
========================= */
elseif ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Thiếu ID bộ thẻ']);
        exit();
    }

    try {
        $stmt = $db->prepare("DELETE FROM decks WHERE id = ?");
        if ($stmt->execute([$id])) {
            http_response_code(200);
            echo json_encode(['message' => 'Đã xóa bộ thẻ']);
        } else {
            throw new Exception("Không thể xóa dữ liệu");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Lỗi khi xóa: ' . $e->getMessage()]);
    }
}
?>