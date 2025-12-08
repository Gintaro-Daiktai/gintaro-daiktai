-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2025 at 12:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tinkluit`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `text` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`id`, `text`, `read_at`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'Your order #ORD-67BWIKNP has been successfully placed! Total: €109.47', '2025-11-12 14:46:13', 3, '2025-11-12 14:46:09', '2025-11-12 14:46:13'),
(14, 'Your order #ORD-2RHECTQ2 has been successfully placed! Total: €164.00', '2025-12-02 16:30:15', 3, '2025-12-02 16:30:11', '2025-12-02 16:30:15'),
(15, 'Your order #ORD-GOE88AUK has been successfully placed! Total: €172.12', NULL, 3, '2025-12-08 16:40:05', '2025-12-08 16:40:05'),
(16, 'Your order #ORD-GOE88AUK status has been updated to: Vykdoma', NULL, 3, '2025-12-08 16:40:39', '2025-12-08 16:40:39'),
(17, 'Your order #ORD-GOE88AUK status has been updated to: Išsiųsta', NULL, 3, '2025-12-08 16:40:40', '2025-12-08 16:40:40'),
(18, 'Your order #ORD-GOE88AUK status has been updated to: Pristatyta', NULL, 3, '2025-12-08 16:40:41', '2025-12-08 16:40:41'),
(19, 'Your order #ORD-GOE88AUK status has been updated to: Laukiama', NULL, 3, '2025-12-08 16:40:45', '2025-12-08 16:40:45'),
(22, 'Your order #ORD-RYFT9ZTC has been successfully placed! Total: €50.00', NULL, 10, '2025-12-08 19:27:43', '2025-12-08 19:27:43'),
(23, 'Your order #ORD-YJDN9RTB has been successfully placed! Total: €24.00', NULL, 10, '2025-12-08 20:39:33', '2025-12-08 20:39:33'),
(24, 'Your order #ORD-YJDN9RTB status has been updated to: Vykdoma', NULL, 10, '2025-12-08 20:58:19', '2025-12-08 20:58:19');

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `text` text NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `text`, `question_id`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'atsakymas123', 4, 8, '2025-12-08 21:01:32', '2025-12-08 21:01:32');

-- --------------------------------------------------------

--
-- Table structure for table `bicycles`
--

CREATE TABLE `bicycles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bicycles`
--

INSERT INTO `bicycles` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(19, 3, 'Mano dviratis', '2025-12-08 16:39:49', '2025-12-08 16:39:49'),
(20, 10, 'Mano dviratis', '2025-12-08 19:03:04', '2025-12-08 19:03:04');

-- --------------------------------------------------------

--
-- Table structure for table `bicycle_components`
--

CREATE TABLE `bicycle_components` (
  `bicycle_id` bigint(20) UNSIGNED NOT NULL,
  `bicycle_part_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bicycle_components`
--

INSERT INTO `bicycle_components` (`bicycle_id`, `bicycle_part_id`, `quantity`, `created_at`, `updated_at`) VALUES
(19, 7, 1, '2025-12-08 16:39:49', '2025-12-08 16:39:49'),
(19, 10, 1, '2025-12-08 16:39:49', '2025-12-08 16:39:49'),
(19, 11, 1, '2025-12-08 16:39:49', '2025-12-08 16:39:49'),
(19, 12, 1, '2025-12-08 16:39:49', '2025-12-08 16:39:49'),
(20, 11, 1, '2025-12-08 19:03:04', '2025-12-08 19:03:04');

-- --------------------------------------------------------

--
-- Table structure for table `bicycle_items`
--

CREATE TABLE `bicycle_items` (
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `bicycle_id` bigint(20) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  `price_at_purchase` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bicycle_items`
--

INSERT INTO `bicycle_items` (`cart_id`, `order_id`, `bicycle_id`, `amount`, `price_at_purchase`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 11, 19, 1, 172.12, 172.12, '2025-12-08 16:39:52', '2025-12-08 16:40:05'),
(7, 13, 20, 1, 50.00, 50.00, '2025-12-08 19:21:19', '2025-12-08 19:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `bicycle_parts`
--

CREATE TABLE `bicycle_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bicycle_parts`
--

INSERT INTO `bicycle_parts` (`id`, `type`, `name`, `amount`, `price`, `description`, `image`, `created_at`, `updated_at`) VALUES
(7, 'wheels', 'tamsūs ratai', 0, 32.12, NULL, 'parts/4vNOo3vWfiA2QTCBNQCrlRcMV9Hdph37HYavYb04.png', '2025-11-11 15:30:12', '2025-12-08 16:40:05'),
(10, 'wheels', 'šviesūs ratai', 0, 50.00, NULL, 'parts/JzYsaT93e4fUmm9HVJgkdwfBrMtLibhkFyYJ1uhq.webp', '2025-11-30 19:00:53', '2025-12-08 16:41:18'),
(11, 'frame', 'žalias rėmas', 0, 50.00, NULL, 'parts/GQxhdNJuY2bT7qqYJedr9VhntwjYZnSrve8BI5rC.jpg', '2025-11-30 19:09:45', '2025-12-08 16:40:05'),
(12, 'handlebars', 'Gelsvas vairas', 0, 67.00, NULL, 'parts/7fcCTBPKvPlC8DLyvm4OF5ZwmeeUPvZ1oqJyt5Jj.png', '2025-11-30 19:21:01', '2025-12-08 16:42:30'),
(13, 'saddle', 'juoda sedynė', 0, 24.00, NULL, 'parts/hgfbo7aQk6Nc8WRQgwEU3tlMKVjSmSJSpwBtpFXF.png', '2025-11-30 19:27:00', '2025-12-08 20:39:33'),
(14, 'pedals', 'juodi pedalai', 2, 25.00, NULL, 'parts/qaEs2HsSEmvXrqPbKt24RDOGqT3c7D6JKgWWBDPN.png', '2025-11-30 19:46:24', '2025-12-08 16:37:50'),
(15, 'frame', 'Juodas rėmas', 1, 30.00, NULL, NULL, '2025-12-08 20:47:08', '2025-12-08 20:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_admin@gmail.com|127.0.0.1', 'i:2;', 1764513280),
('laravel_cache_admin@gmail.com|127.0.0.1:timer', 'i:1764513280;', 1764513280),
('laravel_cache_workertest@gmail.com|127.0.0.1', 'i:1;', 1762897390),
('laravel_cache_workertest@gmail.com|127.0.0.1:timer', 'i:1762897390;', 1762897390);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 3, '2025-11-11 18:49:56', '2025-11-11 18:49:56'),
(7, 10, '2025-12-08 19:21:19', '2025-12-08 19:21:19');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(4, '0001_01_01_000000_create_users_table', 1),
(5, '0001_01_01_000001_create_cache_table', 1),
(6, '0001_01_01_000002_create_jobs_table', 1),
(7, '2025_11_07_000000_add_role_to_users_table', 1),
(8, '2025_11_07_181340_create_bicycles_table', 2),
(9, '2025_11_07_181512_create_bicyclesparts_table', 2),
(10, '2025_11_07_181802_create_carts_table', 2),
(11, '2025_11_07_182046_create_alerts_table', 2),
(12, '2025_11_07_182128_create_questions_table', 2),
(13, '2025_11_07_182202_create_answers_table', 2),
(14, '2025_11_07_182250_create_bicycle_components_table', 2),
(15, '2025_11_07_182351_create_part_items_table', 2),
(16, '2025_11_07_182533_create_bicycle_items_table', 2),
(17, '2025_11_11_171739_add_user_id_to_bicycles_table', 3),
(18, '2025_11_11_201925_add_price_to_bicycle_parts_table', 4),
(19, '2025_11_11_201937_create_orders_table', 4),
(20, '2025_11_11_202001_add_order_fields_to_cart_items', 4),
(21, '2025_11_11_202010_add_order_fields_to_cart_items', 4),
(22, '2025_11_11_204238_set_default_prices_for_existing_parts', 5),
(23, '2025_11_11_204244_set_default_prices_for_existing_parts', 5),
(24, '2025_11_11_220026_add_read_at_to_alerts_table', 6),
(25, '2025_11_30_202459_update_bicycle_part_types_to_simplified_structure', 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `notes` text DEFAULT NULL,
  `ordered_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_amount`, `status`, `payment_method`, `shipping_address`, `notes`, `ordered_at`, `created_at`, `updated_at`) VALUES
(7, 3, 'ORD-U6HDQ0S2', 107.53, 'pending', NULL, 'sasas', 'asas', '2025-11-11 22:06:32', '2025-11-11 20:06:32', '2025-11-11 20:06:32'),
(8, 3, 'ORD-67BWIKNP', 109.47, 'pending', NULL, 'sadasd', 'asdasd', '2025-11-12 16:46:09', '2025-11-12 14:46:08', '2025-11-12 14:46:09'),
(10, 3, 'ORD-2RHECTQ2', 164.00, 'pending', NULL, 'adasdasd', 'asdasdasd\n\n[TRŪKSTA SANDĖLYJE]\n- cool handlebars (dviračiui \'lol\'): reikia 1, sandėlyje 0, trūksta 1\n', '2025-12-02 18:30:11', '2025-12-02 16:30:11', '2025-12-02 16:30:11'),
(11, 3, 'ORD-GOE88AUK', 172.12, 'pending', NULL, 'kkokokp', '\n\n[TRŪKSTA SANDĖLYJE]\n- Gelsvas vairas (dviračiui \'Mano dviratis\'): reikia 1, sandėlyje 0, trūksta 1\n', '2025-12-08 18:40:45', '2025-12-08 16:40:05', '2025-12-08 16:40:45'),
(13, 10, 'ORD-RYFT9ZTC', 50.00, 'pending', NULL, 'asd', 'asd\n\n[TRŪKSTA SANDĖLYJE]\n- žalias rėmas (dviračiui \'Mano dviratis\'): reikia 1, sandėlyje 0, trūksta 1\n', '2025-12-08 21:27:43', '2025-12-08 19:27:43', '2025-12-08 19:27:43'),
(14, 10, 'ORD-YJDN9RTB', 24.00, 'processing', NULL, 'asd', NULL, '2025-12-08 22:58:19', '2025-12-08 20:39:33', '2025-12-08 20:58:19');

-- --------------------------------------------------------

--
-- Table structure for table `part_items`
--

CREATE TABLE `part_items` (
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `bicycle_part_id` bigint(20) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  `price_at_purchase` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `part_items`
--

INSERT INTO `part_items` (`cart_id`, `order_id`, `bicycle_part_id`, `amount`, `price_at_purchase`, `subtotal`, `created_at`, `updated_at`) VALUES
(7, 14, 13, 1, 24.00, 24.00, '2025-12-08 20:37:13', '2025-12-08 20:39:33');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `text` text NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `text`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'Kas yra dviratis?', 10, '2025-12-08 19:25:17', '2025-12-08 19:25:17'),
(4, 'Kas yra dviratis?', 10, '2025-12-08 20:43:15', '2025-12-08 20:43:15');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('nFXMmE9kPehcqTYH9sJ8YnTRj6eLLMHrqC3zGthb', 8, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSHpwY09LUFo4WEdDdDJJc2FNYlpFSXJEUkx2cVJMVHVvd0x5NmV0aiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvcXVlc3Rpb25zLzQiO3M6NToicm91dGUiO3M6MTQ6InF1ZXN0aW9ucy5zaG93Ijt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6ODt9', 1765234893);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` enum('user','worker','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(3, 'admin', 'admintest@gmail.com', NULL, '$2y$12$U3oIWZOnYPSU3AIbj/c/SOq3pROYzTLTKrkOQ1HAiZa1gOiD7AWXe', NULL, '2025-11-07 20:56:55', '2025-11-07 20:56:55', 'admin'),
(8, 'worker test', 'worker@gmail.com', NULL, '$2y$12$VU1iq9CCK0Z6AxL2jjcbn.vUQ3z7i./4ZPzllDqvJxz625itaym7O', NULL, '2025-12-08 16:33:44', '2025-12-08 16:33:44', 'worker'),
(10, 'user 3', 'user@gmail.com', NULL, '$2y$12$JDMUXA7kJfTUJmVwGVHpnuSSKaKTpExg72ogzdGoew/Rw4wX/kHKu', NULL, '2025-12-08 16:44:17', '2025-12-08 16:44:17', 'user'),
(11, 'Admin', 'admin@example.com', '2025-12-08 20:08:43', '$2y$12$t2N1B/8y9UoEywv2aDqMuOa/kAXy0QX1KoWGK0yMCU1QNBVbCV6hW', 'iUIaEdSVpI', '2025-12-08 20:08:44', '2025-12-08 20:08:44', 'admin'),
(12, 'Ms. Jazmyne Lebsack', 'worker@example.com', '2025-12-08 20:08:44', '$2y$12$etl5nycbGtxvMyXoXZBTHeU9sW.lUGLjkakC6dAwqfYIGQWOdowvW', 'XQfhKL5ze2', '2025-12-08 20:08:44', '2025-12-08 20:08:44', 'worker'),
(13, 'Kane Langworth', 'user@example.com', '2025-12-08 20:08:44', '$2y$12$etl5nycbGtxvMyXoXZBTHeU9sW.lUGLjkakC6dAwqfYIGQWOdowvW', 'Nk5ZUoG4ka', '2025-12-08 20:08:44', '2025-12-08 20:08:44', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alerts_user_id_foreign` (`user_id`);

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `answers_question_id_foreign` (`question_id`),
  ADD KEY `answers_user_id_foreign` (`user_id`);

--
-- Indexes for table `bicycles`
--
ALTER TABLE `bicycles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bicycles_user_id_foreign` (`user_id`);

--
-- Indexes for table `bicycle_components`
--
ALTER TABLE `bicycle_components`
  ADD PRIMARY KEY (`bicycle_id`,`bicycle_part_id`),
  ADD KEY `bicycle_components_bicycle_part_id_foreign` (`bicycle_part_id`);

--
-- Indexes for table `bicycle_items`
--
ALTER TABLE `bicycle_items`
  ADD PRIMARY KEY (`cart_id`,`bicycle_id`),
  ADD KEY `bicycle_items_bicycle_id_foreign` (`bicycle_id`),
  ADD KEY `bicycle_items_order_id_foreign` (`order_id`);

--
-- Indexes for table `bicycle_parts`
--
ALTER TABLE `bicycle_parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carts_user_id_unique` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `part_items`
--
ALTER TABLE `part_items`
  ADD PRIMARY KEY (`cart_id`,`bicycle_part_id`),
  ADD KEY `part_items_bicycle_part_id_foreign` (`bicycle_part_id`),
  ADD KEY `part_items_order_id_foreign` (`order_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bicycles`
--
ALTER TABLE `bicycles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `bicycle_parts`
--
ALTER TABLE `bicycle_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bicycles`
--
ALTER TABLE `bicycles`
  ADD CONSTRAINT `bicycles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bicycle_components`
--
ALTER TABLE `bicycle_components`
  ADD CONSTRAINT `bicycle_components_bicycle_id_foreign` FOREIGN KEY (`bicycle_id`) REFERENCES `bicycles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bicycle_components_bicycle_part_id_foreign` FOREIGN KEY (`bicycle_part_id`) REFERENCES `bicycle_parts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bicycle_items`
--
ALTER TABLE `bicycle_items`
  ADD CONSTRAINT `bicycle_items_bicycle_id_foreign` FOREIGN KEY (`bicycle_id`) REFERENCES `bicycles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bicycle_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bicycle_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `part_items`
--
ALTER TABLE `part_items`
  ADD CONSTRAINT `part_items_bicycle_part_id_foreign` FOREIGN KEY (`bicycle_part_id`) REFERENCES `bicycle_parts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `part_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `part_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
