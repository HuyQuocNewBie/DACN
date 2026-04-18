<?php

/**
 * API Endpoint: Test gửi email nhắc nhở (Manual trigger)
 * URL: http://localhost:8000/api/cron/test_send_reminder.php
 * Chỉ dùng để test, không nên để trong production
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../config/email_config.php';

$db = (new Database())->getConnection();
$config = getEmailConfig();

// Kiểm tra cấu hình email
if (empty($config['username']) || empty($config['password'])) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Email configuration missing"]);
    exit;
}

try {
    // Lấy danh sách user có thẻ cần ôn tập hôm nay
    $query = "SELECT DISTINCT u.id, u.email, u.username, 
              COUNT(c.id) as due_count,
              GROUP_CONCAT(DISTINCT d.title SEPARATOR ', ') as deck_names
              FROM users u
              JOIN decks d ON d.user_id = u.id
              JOIN cards c ON c.deck_id = d.id
              WHERE c.next_review_date <= CURDATE() 
              AND u.status = 'active'
              AND u.role = 'learner'
              GROUP BY u.id, u.email, u.username";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $sentCount = 0;
    $failedCount = 0;
    $results = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $userEmail = $row['email'];
        $userName = $row['username'];
        $dueCount = $row['due_count'];
        $deckNames = $row['deck_names'];

        // Tạo nội dung email
        $subject = "🔔 Bạn có $dueCount thẻ cần ôn tập hôm nay!";

        $body = "
            <h2>Xin chào $userName!</h2>
            <p>Hôm nay bạn có <strong style='color: #4F46E5; font-size: 18px;'>$dueCount thẻ</strong> cần ôn tập.</p>
            <p><strong>Bộ thẻ cần ôn:</strong> $deckNames</p>
            <p>Đừng để quên kiến thức, hãy dành ít phút để ôn tập ngay nhé!</p>
            <p style='text-align: center;'>
                <a href='http://localhost:5173/review' class='btn'>Bắt đầu ôn tập ngay</a>
            </p>
            <p style='margin-top: 20px; font-size: 14px; color: #666;'>
                Nếu bạn không muốn nhận email nhắc nhở, hãy tắt thông báo trong cài đặt tài khoản.
            </p>
        ";

        // Gửi email
        $result = sendEmail($userEmail, $userName, $subject, $body);

        if ($result) {
            $sentCount++;
            $results[] = ["email" => $userEmail, "status" => "sent", "due_count" => $dueCount];
        } else {
            $failedCount++;
            $results[] = ["email" => $userEmail, "status" => "failed", "due_count" => $dueCount];
        }
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Email reminder process completed",
        "total_users_with_due_cards" => $stmt->rowCount(),
        "sent_successfully" => $sentCount,
        "sent_failed" => $failedCount,
        "details" => $results
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
