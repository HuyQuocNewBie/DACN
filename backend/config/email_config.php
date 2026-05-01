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
        'from_name' => $_ENV['GMAIL_FROM_NAME'] ?? 'MemoSpace',
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
        $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
        
        $message = "From: =?UTF-8?B?" . base64_encode($this->from_name) . "?= <" . $this->from_email . ">\r\n";
        $message .= "To: =?UTF-8?B?" . base64_encode($toName) . "?= <" . $toEmail . ">\r\n";
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
        $this->socket = fsockopen($this->smtp_host, $this->smtp_port, $errno, $errstr, 30);
        if (!$this->socket) {
            throw new Exception("Cannot connect to SMTP server: $errstr ($errno)");
        }
        $this->readResponse();
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
 * Gửi email sử dụng SimpleSMTP với giao diện gọn gàng (Compact) và Logo CSS
 */
function sendEmail($toEmail, $toName, $subject, $body)
{
    $config = getEmailConfig();

    $htmlBody = '
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Reset cơ bản */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            
            body { 
                margin: 0; 
                padding: 0; 
                background-color: #f4f7f6; 
                font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            }
            .wrapper { 
                width: 100%; 
                background-color: #f4f7f6; 
                padding: 40px 10px; 
            }
            .main-content { 
                max-width: 480px; /* Thu nhỏ khung email lại */
                margin: 0 auto; 
                background-color: #ffffff; 
                border: 1px solid #e1e5e8;
                border-radius: 16px; /* Bo góc tròn hơn chút cho mượt */
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(0,0,0,0.04); 
            }
            .header { 
                padding: 30px 30px 10px 30px; /* Căn chỉnh lại khoảng cách */
                text-align: center; 
            }
            
            /* Logo CSS không cần ảnh */
            .logo-badge {
                display: inline-block;
                background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
                color: #ffffff;
                width: 48px;
                height: 48px;
                line-height: 48px;
                border-radius: 12px;
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                box-shadow: 0 4px 10px rgba(26, 115, 232, 0.25);
                margin: 0;
            }

            .body-text { 
                padding: 20px 30px 30px 30px; 
                font-size: 15px; /* Giảm size chữ một chút cho hợp khung nhỏ */
                line-height: 1.6; 
                color: #4a4a4a; 
            }
            .footer { 
                background-color: #fcfcfc; 
                padding: 25px 30px; 
                border-top: 1px solid #f0f2f4;
                text-align: center; 
            }
            .footer-text { 
                font-size: 13px; 
                color: #888888; 
                margin: 0 0 6px 0; 
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <table class="main-content" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td class="header">
                        <div class="logo-badge">M</div>
                    </td>
                </tr>
                <tr>
                    <td class="body-text">
                        ' . $body . '
                    </td>
                </tr>
                <tr>
                    <td class="footer">
                        <p class="footer-text">Bạn nhận được email này từ hệ thống nhắc nhở của chúng tôi</p>
                        <p class="footer-text">© ' . date("Y") . ' MemoSpace</p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>';

    try {
        $smtp = new SimpleSMTP($config);
        return $smtp->send($toEmail, $toName, $subject, $htmlBody);
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Hàm body cũng được tinh chỉnh lại padding/font-size để vừa vặn với khung 480px
 */
function getReminderEmailBody($userName, $dueCount, $deckNames, $reviewUrl) {
    return "
        <p style='margin: 0 0 15px 0; font-size: 17px; color: #202124;'>Chào <strong>" . htmlspecialchars($userName) . "</strong> 👋</p>
        
        <p style='margin: 0 0 25px 0; color: #5f6368; font-size: 15px;'>Đã đến lúc củng cố kiến thức của bạn. Dưới đây là tóm tắt lịch trình hôm nay:</p>
        
        <div style='background-color: #f8fafd; border-radius: 12px; padding: 25px 20px; margin-bottom: 30px; text-align: center; border: 1px solid #e4edf8;'>
            <div style='font-size: 46px; font-weight: 700; color: #1a73e8; line-height: 1; margin-bottom: 8px;'>
                " . (int)$dueCount . "
            </div>
            <div style='font-size: 13px; color: #6e7781; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;'>
                Thẻ cần ôn tập hôm nay
            </div>
            
            <div style='margin: 20px 0; height: 1px; background-color: #e4edf8;'></div>
            
            <div style='font-size: 14px; color: #3c4043; text-align: left; background-color: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #e1e5e8;'>
                <strong style='color: #202124; display: block; margin-bottom: 6px;'>📚 Bộ thẻ bao gồm:</strong>
                <span style='color: #5f6368; display: block; line-height: 1.5;'>" . htmlspecialchars($deckNames) . "</span>
            </div>
        </div>

        <div style='text-align: center; margin: 5px 0 10px 0;'>
            <a href='" . htmlspecialchars($reviewUrl) . "' style='background-color: #1a73e8; color: #ffffff; padding: 14px 0; width: 100%; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(26, 115, 232, 0.15); box-sizing: border-box;'>Bắt Đầu Ôn Tập Ngay</a>
        </div>
    ";
}