-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th4 20, 2026 lúc 11:29 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `spaced_repetition_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `deck_id` int(11) NOT NULL,
  `front_content` text NOT NULL,
  `front_image_url` varchar(512) DEFAULT NULL,
  `back_content` text NOT NULL,
  `back_image_url` varchar(512) DEFAULT NULL,
  `repetitions` int(11) DEFAULT 0,
  `ease_factor` float DEFAULT 2.5,
  `review_interval` int(11) DEFAULT 0,
  `next_review_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cards`
--

INSERT INTO `cards` (`id`, `deck_id`, `front_content`, `front_image_url`, `back_content`, `back_image_url`, `repetitions`, `ease_factor`, `review_interval`, `next_review_date`, `created_at`) VALUES
(1, 2, 'Hằng (constant) là gì?', NULL, 'Hằng là giá trị không thể thay đổi sau khi đã được khai báo', NULL, 1, 2.6, 1, '2026-04-16', '2026-04-14 03:02:53'),
(2, 2, 'Biến (variable) là gì?', NULL, 'Biến là nơi lưu trữ dữ liệu và có thể thay đổi giá trị trong quá trình chạy chương trình', NULL, 1, 2.36, 1, '2026-04-16', '2026-04-14 03:02:53'),
(3, 3, 'Hằng (constant) là gì?', NULL, 'Hằng là giá trị không thể thay đổi sau khi đã được khai báo', NULL, 2, 2.7, 6, '2026-04-21', '2026-04-14 03:03:50'),
(4, 3, 'Biến (variable) là gì?', NULL, 'Biến là nơi lưu trữ dữ liệu và có thể thay đổi giá trị trong quá trình chạy chương trình', NULL, 2, 2.6, 6, '2026-04-21', '2026-04-14 03:03:50'),
(5, 4, 'Cơ sở dữ liệu (Database) là gì?', NULL, 'Là hệ thống lưu trữ dữ liệu có tổ chức để dễ dàng truy xuất, quản lý và cập nhật.', NULL, 2, 2.36, 6, '2026-04-24', '2026-04-17 01:10:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `decks`
--

CREATE TABLE `decks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `decks`
--

INSERT INTO `decks` (`id`, `user_id`, `title`, `description`, `is_public`, `created_at`) VALUES
(2, 1, 'Lập trình cơ bản', 'Bộ thẻ giúp nắm vững các khái niệm nền tảng trong lập trình như biến, kiểu dữ liệu, điều kiện và vòng lặp.', 1, '2026-04-14 03:01:37'),
(3, 5, 'Lập trình cơ bản', 'Bộ thẻ giúp nắm vững các khái niệm nền tảng trong lập trình như biến, kiểu dữ liệu, điều kiện và vòng lặp.', 0, '2026-04-14 03:03:50'),
(4, 5, 'Cơ sở dữ liệu', 'Bộ thẻ giúp hiểu các khái niệm quan trọng trong cơ sở dữ liệu như bảng, khóa, quan hệ và truy vấn SQL', 0, '2026-04-17 01:09:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review_logs`
--

CREATE TABLE `review_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `quality` int(11) NOT NULL,
  `reviewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `review_logs`
--

INSERT INTO `review_logs` (`id`, `user_id`, `card_id`, `quality`, `reviewed_at`) VALUES
(1, 5, 3, 5, '2026-04-14 03:22:41'),
(2, 5, 4, 4, '2026-04-14 03:22:49'),
(3, 5, 3, 5, '2026-04-15 00:50:30'),
(4, 5, 4, 5, '2026-04-15 00:50:33'),
(5, 1, 1, 5, '2026-04-15 00:58:15'),
(6, 1, 2, 3, '2026-04-15 00:58:16'),
(7, 5, 5, 3, '2026-04-17 01:18:09'),
(8, 5, 5, 4, '2026-04-18 01:43:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('learner','admin') DEFAULT 'learner',
  `status` enum('active','banned') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `avatar`, `password_hash`, `role`, `status`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', 'uploads/avatars/avatar_1_1776233259.jpg', '$2a$10$dbq6r1cYxvcmfN2zx9o7guqZaIeWwDESZwHpGjJil45v9etUV1rk6', 'admin', 'active', '2026-04-14 02:22:36'),
(5, 'Quốc', 'songuku61@gmail.com', NULL, '$2y$10$tIfqAqRc0yOSzD0baN/jz.Cj9r/N7NOH73MzrvUCr70DWMnDtCpZW', 'learner', 'active', '2026-04-14 02:47:53');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deck_id` (`deck_id`);

--
-- Chỉ mục cho bảng `decks`
--
ALTER TABLE `decks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `review_logs`
--
ALTER TABLE `review_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `card_id` (`card_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `decks`
--
ALTER TABLE `decks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `review_logs`
--
ALTER TABLE `review_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `decks`
--
ALTER TABLE `decks`
  ADD CONSTRAINT `decks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `review_logs`
--
ALTER TABLE `review_logs`
  ADD CONSTRAINT `review_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_logs_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
