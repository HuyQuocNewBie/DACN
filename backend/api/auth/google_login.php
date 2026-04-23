<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../config/jwt_helper.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['credential'])) {
    http_response_code(400);
    echo json_encode(["message" => "Thiếu Google credential."]);
    exit();
}

$access_token = $data['credential'];

// Lấy thông tin user từ Google userinfo endpoint
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.googleapis.com/oauth2/v3/userinfo");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $access_token]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code(401);
    echo json_encode(["message" => "Google token không hợp lệ."]);
    exit();
}

$google_user   = json_decode($response, true);
$email         = $google_user['email']   ?? null;
$name          = $google_user['name']    ?? ($email ? explode('@', $email)[0] : 'Người dùng');
$google_avatar = $google_user['picture'] ?? null;

if (!$email) {
    http_response_code(401);
    echo json_encode(["message" => "Không lấy được email từ Google."]);
    exit();
}

try {
    $db = (new Database())->getConnection();

    // Kiểm tra user đã tồn tại chưa
    $stmt = $db->prepare("SELECT id, username, role, avatar, status FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // User đã tồn tại → đăng nhập
        if (isset($user['status']) && $user['status'] === 'banned') {
            http_response_code(403);
            echo json_encode(["message" => "Tài khoản của bạn đã bị khóa."]);
            exit();
        }
        $user_id       = $user['id'];
        $username      = $user['username'];
        $role          = $user['role'];
        // Nếu user chưa có avatar trong DB, cập nhật avatar Google
        $avatar_url = $user['avatar'] ?: $google_avatar;
        if (!$user['avatar'] && $google_avatar) {
            $stmt2 = $db->prepare("UPDATE users SET avatar = ? WHERE id = ?");
            $stmt2->execute([$google_avatar, $user_id]);
        }
    } else {
        // User chưa tồn tại → tạo tài khoản mới (không có mật khẩu)
        $username = $name;
        $role     = 'user';
        $avatar_url = $google_avatar;

        $stmt = $db->prepare(
            "INSERT INTO users (email, username, password_hash, role, avatar, created_at)
             VALUES (?, ?, '', 'user', ?, NOW())"
        );
        $stmt->execute([$email, $username, $google_avatar]);
        $user_id = $db->lastInsertId();
    }

    // Tạo JWT token
    $payload = [
        "id"    => (int)$user_id,
        "email" => $email,
        "role"  => $role,
        "iat"   => time(),
        "exp"   => time() + (7 * 24 * 60 * 60)
    ];
    $token = JWT::encode($payload);

    http_response_code(200);
    echo json_encode([
        "message"  => "Đăng nhập Google thành công.",
        "token"    => $token,
        "role"     => $role,
        "username" => $username,
        "email"    => $email,
        "avatar"   => $avatar_url
    ]);

} catch (Throwable $e) { // Sửa Exception thành Throwable
    http_response_code(500);
    echo json_encode([
        "message" => "Lỗi server: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
?>