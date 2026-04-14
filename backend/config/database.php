<?php
class Database
{
    private $servername;
    private $port;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        $this->loadEnv(__DIR__ . '/../.env');
        $this->servername = getenv('DB_HOST') ?: "localhost";
        $this->port = getenv('DB_PORT') ?: "3306";
        $this->db_name = getenv('DB_NAME') ?: "spaced_repetition";
        $this->username = getenv('DB_USER') ?: "root";
        $this->password = getenv('DB_PASS') ?: "";
    }

    private function loadEnv($filePath)
    {
        if (!file_exists($filePath)) {
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0)
                continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }

    public function getConnection()
    {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->servername . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";

            $this->conn = new PDO($dsn, $this->username, $this->password);

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        } catch (PDOException $exception) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi kết nối CSDL: " . $exception->getMessage()
            ]);
            exit;
        }
        return $this->conn;
    }
}
?>