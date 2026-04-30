<?php

/**
 * Cron Job: Gửi email nhắc nhở ôn tập hàng ngày
 * Gọi qua HTTP GET: /api/cron/send_reminder_emails.php?secret=YOUR_SECRET
 */

header("Content-Type: application/json; charset=UTF-8");

// ===== BẢO VỆ BẰNG SECRET KEY =====
$cronSecret = getenv('CRON_SECRET') ?: 'memorize_cron_2026';
$providedSecret = $_GET['secret'] ?? '';
if ($providedSecret !== $cronSecret) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Forbidden"]);
    exit;
}
// ====================================

// Cho phép script tiếp tục chạy dù cron-job.org ngắt kết nối sau 30s
ignore_user_abort(true);
set_time_limit(300); // Tối đa 5 phút

include_once '../../config/database.php';
include_once '../../config/email_config.php';

$db = (new Database())->getConnection();
$config = getEmailConfig();

if (empty($config['username']) || empty($config['password'])) {
    echo json_encode(["status" => "error", "message" => "Email configuration missing"]);
    exit;
}

try {
    // Lấy tất cả user có thẻ cần ôn hôm nay
    $query = "SELECT DISTINCT u.id, u.email, u.username,
              COUNT(c.id) as due_count,
              GROUP_CONCAT(DISTINCT d.title SEPARATOR ', ') as deck_names
              FROM users u
              JOIN decks d ON d.user_id = u.id
              JOIN cards c ON c.deck_id = d.id
              WHERE c.next_review_date <= CURDATE()
              AND u.status = 'active'
              AND u.role != 'admin'
              GROUP BY u.id, u.email, u.username
              HAVING due_count > 0";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $sentCount   = 0;
    $failedCount = 0;
    $results     = [];

    $reviewUrl = (getenv('APP_URL') ?: 'https://memorize-virid.vercel.app') . '/dashboard';

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $userEmail = $row['email'];
        $userName  = $row['username'] ?: explode('@', $userEmail)[0];
        $dueCount  = $row['due_count'];
        $deckNames = $row['deck_names'];

        $subject = "🔔 Bạn có {$dueCount} thẻ cần ôn tập hôm nay!";
        $body    = getReminderEmailBody($userName, $dueCount, $deckNames, $reviewUrl);

        $result = sendEmail($userEmail, $userName, $subject, $body);

        if ($result) {
            $sentCount++;
            $results[] = ["email" => $userEmail, "status" => "sent"];
        } else {
            $failedCount++;
            $results[] = ["email" => $userEmail, "status" => "failed"];
        }

        // Nghỉ 1 giây giữa mỗi lần gửi để tránh spam Gmail
        sleep(1);
    }

    echo json_encode([
        "status"  => "success",
        "date"    => date('Y-m-d H:i:s'),
        "total"   => count($results),
        "sent"    => $sentCount,
        "failed"  => $failedCount,
        "details" => $results
    ]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}