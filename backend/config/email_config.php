<?php

/**
 * Email Configuration - Direct SMTP without Composer
 */

function loadEnv($filePath)
{
    if (!file_exists($filePath)) return;

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
        }
    }
}

// Load .env file
loadEnv(__DIR__ . '/../.env');

function getEmailConfig()
{
    return [
        'smtp_host' => $_ENV['GMAIL_SMTP_HOST'] ?? 'smtp.gmail.com',
        'smtp_port' => $_ENV['GMAIL_SMTP_PORT'] ?? 587,
        'username' => $_ENV['GMAIL_EMAIL'] ?? '',
        'password' => $_ENV['GMAIL_APP_PASSWORD'] ?? '',
        'from_email' => $_ENV['GMAIL_EMAIL'] ?? '',
        'from_name' => $_ENV['GMAIL_FROM_NAME'] ?? 'Spaced Repetition',
    ];
}

/**
 * Simple SMTP Mailer - Gửi email qua SMTP Gmail sử dụng PHP socket
 */
class SimpleSMTP
{
    private $smtp_host;
    private $smtp_port;
    private $username;
    private $password;
    private $from_email;
    private $from_name;
    private $socket;

    public function __construct($config)
    {
        $this->smtp_host = $config['smtp_host'];
        $this->smtp_port = $config['smtp_port'];
        $this->username = $config['username'];
        $this->password = $config['password'];
        $this->from_email = $config['from_email'];
        $this->from_name = $config['from_name'];
    }

    public function send($toEmail, $toName, $subject, $htmlBody)
    {
        $this->connect();

        // EHLO
        $this->sendCommand("EHLO " . $this->smtp_host);
        $res = $this->readResponse();

        // STARTTLS
        if ($this->smtp_port == 587 || $this->smtp_port == 25) {
            $this->sendCommand("STARTTLS");
            $res = $this->readResponse();
            if (substr($res, 0, 3) === '220') {
                stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                // Send EHLO again after TLS handshake
                $this->sendCommand("EHLO " . $this->smtp_host);
                $this->readResponse();
            }
        }

        // AUTH LOGIN
        $this->sendCommand("AUTH LOGIN");
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("AUTH LOGIN failed: " . $res);

        // Username (base64)
        $this->sendCommand(base64_encode($this->username));
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("Username failed: " . $res);

        // Password (base64)
        $this->sendCommand(base64_encode($this->password));
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("Password failed: " . $res);

        // MAIL FROM
        $this->sendCommand("MAIL FROM:<" . $this->from_email . ">");
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("MAIL FROM failed: " . $res);

        // RCPT TO
        $this->sendCommand("RCPT TO:<" . $toEmail . ">");
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("RCPT TO failed: " . $res);

        // DATA
        $this->sendCommand("DATA");
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("DATA failed: " . $res);

        // Build email content
        // encode subject properly for utf8
        $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
        
        $message = "From: " . $this->from_name . " <" . $this->from_email . ">\r\n";
        $message .= "To: " . $toName . " <" . $toEmail . ">\r\n";
        $message .= "Subject: " . $encodedSubject . "\r\n";
        $message .= "MIME-Version: 1.0\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "\r\n";
        $message .= $htmlBody . "\r\n";
        $message .= ".\r\n";

        fwrite($this->socket, $message);
        $res = $this->readResponse();
        if (substr($res, 0, 1) == '4' || substr($res, 0, 1) == '5') throw new Exception("Message content failed: " . $res);

        // QUIT
        $this->sendCommand("QUIT");
        $this->readResponse();

        $this->disconnect();

        return true;
    }

    private function connect()
    {
        $this->socket = fsockopen(
            $this->smtp_host,
            $this->smtp_port,
            $errno,
            $errstr,
            30
        );

        if (!$this->socket) {
            throw new Exception("Cannot connect to SMTP server: $errstr ($errno)");
        }

        $this->readResponse(); // Read greeting
    }

    private function disconnect()
    {
        if ($this->socket) {
            fclose($this->socket);
        }
    }

    private function sendCommand($command)
    {
        fwrite($this->socket, $command . "\r\n");
    }

    private function readResponse()
    {
        $response = '';
        while ($line = fgets($this->socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $response;
    }
}

/**
 * Gửi email sử dụng SimpleSMTP
 */
function sendEmail($toEmail, $toName, $subject, $body)
{
    $config = getEmailConfig();

    // Wrap body in HTML template
    $htmlBody = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            .btn { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 Nhắc nhở ôn tập</h1>
            </div>
            <div class="content">
                ' . $body . '
            </div>
            <div class="footer">
                <p>© 2026 Spaced Repetition App</p>
            </div>
        </div>
    </body>
    </html>
    ';

    try {
        $smtp = new SimpleSMTP($config);
        return $smtp->send($toEmail, $toName, $subject, $htmlBody);
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}
