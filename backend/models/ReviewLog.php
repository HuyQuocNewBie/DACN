<?php
class ReviewLog {
    private $conn;
    private $table_name = "review_logs";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy 10 hoạt động ôn tập mới nhất cho Admin
    public function readRecent() {
        $query = "SELECT 
                    rl.id, 
                    u.username, 
                    rl.quality, 
                    rl.reviewed_at as created_at, 
                    c.front_content as card_name,
                    d.title as deck_name
                  FROM " . $this->table_name . " rl
                  JOIN users u ON rl.user_id = u.id
                  JOIN cards c ON rl.card_id = c.id
                  JOIN decks d ON c.deck_id = d.id
                  ORDER BY rl.reviewed_at DESC 
                  LIMIT 10";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>