<?php
// Nhúng file database vào
require_once 'database.php';

// Khởi tạo đối tượng
$db = new Database();
// Chạy hàm lấy kết nối
$connection = $db->getConnection();
?>
