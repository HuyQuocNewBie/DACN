<?php
class User
{
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password_hash;
    public $role;
    public $status;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Kiem tra xem email ton tai khong
    public function emailExists()
    {
        $query = "SELECT id, username, password_hash, role, IFNULL(status, 'active') as status
                  FROM " . $this->table_name . "
                  WHERE email = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->username = $row['username'];
            $this->password_hash = $row['password_hash'];
            $this->role = $row['role'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    // Them User moi
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET username = :username, email = :email, password_hash = :password_hash";

        $stmt = $this->conn->prepare($query);

        // Loai bo tag html (Chong script injection)
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->username = htmlspecialchars(strip_tags($this->username));

        // Bind cac the
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password_hash', $this->password_hash);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
