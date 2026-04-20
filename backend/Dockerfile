FROM php:8.2-apache

# Cài đặt extension MySQL (PDO) để tương thích kết nối Aiven
RUN docker-php-ext-install pdo pdo_mysql

# Kích hoạt module URL Rewrite (để sử dụng API dễ dàng hơn nếu cần)
RUN a2enmod rewrite

# Gắn toàn bộ mã nguồn thư mục Backend vào trạm máy chủ Apache
COPY . /var/www/html/

# Bắt buộc đổi Cổng kết nối của Apache thành Cổng $PORT do Render yêu cầu
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
