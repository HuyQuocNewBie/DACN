<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if (!$user_data || ($user_data->role ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit();
}

$db = (new Database())->getConnection();

function hasColumn($db, $table, $column)
{
    $stmt = $db->prepare("SHOW COLUMNS FROM `$table` LIKE ?");
    $stmt->execute([$column]);
    return $stmt->rowCount() > 0;
}

function ensureStatusColumn($db)
{
    if (!hasColumn($db, 'users', 'status')) {
        $db->exec("ALTER TABLE users ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'active'");
    }
}

try {
    ensureStatusColumn($db);

    $hasCreatedAt = hasColumn($db, 'users', 'created_at');
    $createdAtExpr = $hasCreatedAt ? 'created_at AS createdAt' : "'' AS createdAt";

    $stmt = $db->prepare("SELECT id, username, email, role, avatar, IFNULL(status, 'active') AS status, $createdAtExpr FROM users ORDER BY id DESC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Không thể tải danh sách người dùng']);
}
