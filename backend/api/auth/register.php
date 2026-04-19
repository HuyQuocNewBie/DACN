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

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    $username = trim($data->username);
    $email = $data->email;
    $password = $data->password;

    // Validate Email
    if (preg_match('/\s/', $email)) {
        http_response_code(400); echo json_encode(["message" => "Email không được chứa khoảng trắng."]); exit();
    }
    if (!str_ends_with($email, "@gmail.com")) {
        http_response_code(400); echo json_encode(["message" => "Email đăng ký bắt buộc phải là @gmail.com."]); exit();
    }
    
    $localPart = explode('@', $email)[0];
    
    // ĐÃ SỬA: Tăng giới hạn tên email (trước @) lên 64 ký tự
    if (strlen($localPart) < 5 || strlen($localPart) > 64) {
        http_response_code(400); echo json_encode(["message" => "Tên Gmail phải từ 5 đến 64 ký tự."]); exit();
    }

    // --- CẬP NHẬT LOGIC MẬT KHẨU TẠI ĐÂY ---
    if (preg_match('/\s/', $password)) {
        http_response_code(400); echo json_encode(["message" => "Mật khẩu không được có khoảng trắng."]); exit();
    }
    
    // ĐÃ SỬA: Tăng giới hạn độ dài mật khẩu lên 64 ký tự
    if (strlen($password) < 8 || strlen($password) > 64) {
        http_response_code(400); echo json_encode(["message" => "Mật khẩu phải từ 8 đến 64 ký tự."]); exit();
    }
    
    // Kiểm tra: Có chữ cái VÀ (Số hoặc ký tự đặc biệt)
    $hasLetter = preg_match('/[a-zA-Z]/', $password);
    $hasNumberOrSpecial = preg_match('/[0-9\W_]/', $password);

    if (!$hasLetter || !$hasNumberOrSpecial) {
        http_response_code(400); 
        echo json_encode(["message" => "Mật khẩu phải bao gồm chữ cái và ít nhất một số hoặc ký tự đặc biệt."]); 
        exit();
    }

    $user->email = $email;
    if ($user->emailExists()) {
        http_response_code(409);
        echo json_encode(array("message" => "Email này đã được sử dụng!"));
    } else {
        $user->username = $username;
        $user->password_hash = password_hash($password, PASSWORD_BCRYPT);
        
        if ($user->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Đăng ký thành công!"));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Lỗi Server không thể tạo tài khoản."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Vui lòng nhập đầy đủ thông tin."));
}
?>