<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/User.php';
include_once '../../config/jwt_helper.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Nhận JSON từ ReactJS
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = $data->email;
    $password = $data->password;

    // Chỉ check tính hợp lệ cơ bản của Email
    if (preg_match('/\s/', $email) || !str_ends_with($email, "@gmail.com")) {
        http_response_code(400);
        echo json_encode(["message" => "Email không hợp lệ."]);
        exit();
    }
    
    // ĐÃ SỬA: Xóa biến $localPart dư thừa
    // ĐÃ SỬA: Đổi lại câu thông báo lỗi cho chuẩn với logic check khoảng trắng
    if (preg_match('/\s/', $password)) {
        http_response_code(400);
        echo json_encode(["message" => "Mật khẩu không được chứa khoảng trắng."]);
        exit();
    }

    $user->email = $email;
    $email_exists = $user->emailExists();

    // Đối chiếu Password gõ vào với Password đã rải băm (Hash) lưu trong DB
    if ($email_exists && password_verify($password, $user->password_hash)) {
        if (isset($user->status) && $user->status === 'banned') {
            http_response_code(403);
            echo json_encode(array("message" => "Tài khoản của bạn đã bị khóa."));
            exit();
        }

        http_response_code(200);

        // Gói sơ yếu lý lịch vào Payload của Token và cho Hạn dùng 7 Ngày
        $payload = [
            "id" => $user->id,
            "email" => $user->email,
            "role" => $user->role,
            "iat" => time(),
            "exp" => time() + (7 * 24 * 60 * 60)
        ];

        // Mã hóa HS256 sinh ra Token Chuyên Nghiệp
        $token = JWT::encode($payload);

        echo json_encode(
            array(
                "message" => "Đăng nhập thành công.",
                "token" => $token,
                "role" => $user->role,
                "username" => $user->username,
                "avatar" => $user->avatar ? (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/' . ltrim($user->avatar, '/') : null
            )
        );
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
    }
} else {
    http_response_code(400); // Bad request
    echo json_encode(array("message" => "Xin vui lòng điền đủ Email và Mật khẩu."));
}
?>