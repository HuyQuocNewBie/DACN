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

if (!$user_data) {
    http_response_code(401);
    exit();
}

$db = (new Database())->getConnection();
$uid = $user_data->id;

$stats = [
    'total_decks' => 0,
    'due_today' => 0,
    'new_cards' => 0,
    'learning_cards' => 0,
    'mastered_cards' => 0,
    'retention_rate' => 0,
    'recent_activities' => [],
    'due_deck_id' => null
];

try {
    $stmtDecks = $db->prepare("SELECT COUNT(*) as count FROM decks WHERE user_id = ?");
    $stmtDecks->execute([$uid]);
    $stats['total_decks'] = (int) $stmtDecks->fetch(PDO::FETCH_ASSOC)['count'];

    $queryCards = "SELECT 
                      SUM(CASE WHEN next_review_date <= CURDATE() THEN 1 ELSE 0 END) as due_today,
                      SUM(CASE WHEN repetitions = 0 THEN 1 ELSE 0 END) as new_cards,
                      SUM(CASE WHEN repetitions > 0 AND review_interval < 21 THEN 1 ELSE 0 END) as learning_cards,
                      SUM(CASE WHEN review_interval >= 21 THEN 1 ELSE 0 END) as mastered_cards
                   FROM cards c
                   JOIN decks d ON c.deck_id = d.id
                   WHERE d.user_id = ?";
    $stmtCards = $db->prepare($queryCards);
    $stmtCards->execute([$uid]);
    if ($rowCards = $stmtCards->fetch(PDO::FETCH_ASSOC)) {
        $stats['due_today'] = (int) $rowCards['due_today'];
        $stats['new_cards'] = (int) $rowCards['new_cards'];
        $stats['learning_cards'] = (int) $rowCards['learning_cards'];
        $stats['mastered_cards'] = (int) $rowCards['mastered_cards'];
    }

    $queryLogs = "SELECT COUNT(*) as total_reviews, 
                         SUM(CASE WHEN quality >= 3 THEN 1 ELSE 0 END) as correct_reviews
                  FROM review_logs WHERE user_id = ?";
    $stmtLogs = $db->prepare($queryLogs);
    $stmtLogs->execute([$uid]);
    $rowLogs = $stmtLogs->fetch(PDO::FETCH_ASSOC);

    $totalReviews = (int) $rowLogs['total_reviews'];
    $correctReviews = (int) $rowLogs['correct_reviews'];

    if ($totalReviews > 0) {
        $stats['retention_rate'] = round(($correctReviews / $totalReviews) * 100);
    } else {
        $stats['retention_rate'] = 100;
    }

    $queryActivities = "SELECT r.quality, r.reviewed_at as time, c.front_content, d.title as deck_name
                    FROM review_logs r
                    JOIN cards c ON r.card_id = c.id
                    JOIN decks d ON c.deck_id = d.id
                    WHERE r.user_id = ?
                    ORDER BY r.reviewed_at DESC LIMIT 5";
    $stmtActivities = $db->prepare($queryActivities);
    $stmtActivities->execute([$uid]);

    $qualitiesTranslate = [
        0 => 'Chưa thuộc',
        3 => 'Ghi nhớ Khó',
        4 => 'Ghi nhớ Tốt',
        5 => 'Ghi nhớ Rất Dễ'
    ];

    while ($row = $stmtActivities->fetch(PDO::FETCH_ASSOC)) {
        $frontStr = mb_strlen($row['front_content']) > 25
            ? mb_substr($row['front_content'], 0, 25) . "..."
            : $row['front_content'];

        $qText = isset($qualitiesTranslate[$row['quality']]) ? $qualitiesTranslate[$row['quality']] : 'Ôn tập';

        $stats['recent_activities'][] = [
            'time' => $row['time'],
            'card_content' => $frontStr,
            'deck_name' => $row['deck_name'],
            'quality_text' => $qText,
            'quality_score' => $row['quality']
        ];
    }

    $queryDueDeck = "SELECT d.id FROM decks d
                 JOIN cards c ON c.deck_id = d.id
                 WHERE d.user_id = ? AND c.next_review_date <= CURDATE()
                 LIMIT 1";
    $stmtDueDeck = $db->prepare($queryDueDeck);
    $stmtDueDeck->execute([$uid]);
    $rowDueDeck = $stmtDueDeck->fetch(PDO::FETCH_ASSOC);
    $stats['due_deck_id'] = $rowDueDeck ? (int) $rowDueDeck['id'] : null;

    $weekly_progress = [];
    $monday = date('Y-m-d', strtotime('monday this week'));

    for ($i = 0; $i < 7; $i++) {
        $date = date('Y-m-d', strtotime("$monday +$i days"));

        $queryWeekly = "SELECT COUNT(*) as count FROM review_logs 
                    WHERE user_id = ? AND DATE(reviewed_at) = ?";
        $stmtWeekly = $db->prepare($queryWeekly);
        $stmtWeekly->execute([$uid, $date]);
        $count = (int) $stmtWeekly->fetch(PDO::FETCH_ASSOC)['count'];

        $max_daily_cards = 50;
        $height_percentage = ($count / $max_daily_cards) * 100;
        $weekly_progress[] = min($height_percentage, 100);
    }
    $stats['weekly_progress'] = $weekly_progress;

    $queryToday = "SELECT COUNT(*) as current_reviewed FROM review_logs 
               WHERE user_id = ? AND DATE(reviewed_at) = CURDATE()";
    $stmtToday = $db->prepare($queryToday);
    $stmtToday->execute([$uid]);
    $current_reviewed = (int) $stmtToday->fetch(PDO::FETCH_ASSOC)['current_reviewed'];

    $estimated_minutes = round(($current_reviewed * 15) / 60);

    $stats['daily_cards_goal'] = [
        'current' => $current_reviewed,
        'target' => 50
    ];
    $stats['daily_time_goal'] = [
        'current' => $estimated_minutes,
        'target' => 30
    ];

    http_response_code(200);
    echo json_encode($stats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Lỗi truy xuất hệ thống thống kê.', 'error' => $e->getMessage()]);
}
