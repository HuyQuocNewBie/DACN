<?php
// Tránh lỗi CORS khi React (Port: 3000/5173) đẩy dữ liệu sang PHP
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gọi các file thiết yếu
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/User.php';

// Khởi tạo DB
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Bắt dữ liệu JSON từ Frontend ReactJS gửi sang
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->fullname) && !empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;

    // Xem Email đã đụng hàng chưa
    if ($user->emailExists()) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Email này đã được sử dụng!"));
    } else {
        $user->fullname = $data->fullname;
        // Mã hóa mật khẩu bảo mật tuyệt đối
        // Bắt buộc xài PASSWORD_BCRYPT theo chuẩn đồ án CNTT hiện nay
        $user->password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        
        if ($user->create()) {
            http_response_code(201); // Created
            echo json_encode(array("message" => "Đăng ký thành công!"));
        } else {
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Không thể đăng ký. Lỗi Server."));
        }
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Vui lòng nhập đầy đủ thông tin."));
}
?>
