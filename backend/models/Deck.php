<?php
class Deck {
    private $conn;
    private $table_name = "decks";
    public $id;
    public $user_id;

    public $title;
    public $description;
    public $is_public;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readByUser() {
        $query = "SELECT d.id, d.title, d.description, d.is_public, d.created_at,
                   (SELECT COUNT(*) FROM cards WHERE deck_id = d.id) as cards_count
                  FROM " . $this->table_name . " d
                  WHERE d.user_id = :user_id
                  ORDER BY d.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function readPublic() {
        $query = "SELECT d.id, d.title, d.description, u.username as author_name,
                   (SELECT COUNT(*) FROM cards WHERE deck_id = d.id) as cards_count
                  FROM " . $this->table_name . " d
                  LEFT JOIN users u ON d.user_id = u.id
                  WHERE d.is_public = 1
                  ORDER BY d.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET user_id=:user_id, title=:title, description=:description, is_public=:is_public";
        
        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":is_public", $this->is_public);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function readSingle() {
        $query = "SELECT d.id, d.title, d.description, d.is_public, d.created_at, d.user_id,
                   (SELECT COUNT(*) FROM cards WHERE deck_id = d.id) as cards_count
                  FROM " . $this->table_name . " d
                  WHERE d.id = :id LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET title = :title, description = :description, is_public = :is_public
                  WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':is_public', $this->is_public);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':user_id', $this->user_id);
        return $stmt->execute();
    }
}
?>
