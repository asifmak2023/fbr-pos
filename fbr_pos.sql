-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2026 at 09:44 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fbr_pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `purchase_price` float DEFAULT NULL,
  `selling_price` float DEFAULT NULL,
  `wholesale_price` float DEFAULT NULL,
  `retail_price` float DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `min_stock_level` float DEFAULT NULL,
  `reorder_level` float DEFAULT NULL,
  `reorder_quantity` float DEFAULT NULL,
  `hs_code` varchar(20) DEFAULT NULL,
  `tax_rate` varchar(20) DEFAULT NULL,
  `uom` varchar(50) DEFAULT NULL,
  `sale_type` varchar(100) DEFAULT NULL,
  `sro_schedule_no` varchar(50) DEFAULT NULL,
  `is_fed_applicable` tinyint(1) DEFAULT NULL,
  `fed_rate` float DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_taxable` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `barcode`, `name`, `description`, `category`, `purchase_price`, `selling_price`, `wholesale_price`, `retail_price`, `quantity`, `min_stock_level`, `reorder_level`, `reorder_quantity`, `hs_code`, `tax_rate`, `uom`, `sale_type`, `sro_schedule_no`, `is_fed_applicable`, `fed_rate`, `is_active`, `is_taxable`, `created_at`, `updated_at`) VALUES
(1, 'string', 'string', 'Test Product', 'string', 'string', 0, 0, 0, 10, 100, 0, 0, 0, 'string', 'string', 'string', 'string', 'string', 0, 0, 1, 1, '2026-08-16 14:50:11', NULL),
(2, 'TEST001', NULL, 'Test Product', NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 1, '2026-08-16 15:13:28', NULL),
(4, 'tesing', NULL, 'Testing Product', NULL, NULL, 0, 1000, 0, 0, 1000, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 1, '2026-08-16 15:17:29', NULL),
(5, 'testing testing', NULL, 'Testing testing Product', NULL, NULL, 0, 20, 0, 0, 40, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 1, '2026-08-16 15:24:29', NULL),
(7, 'ali imran msc phd oxon', NULL, 'Testing2 testing Product', NULL, NULL, 0, 210, 0, 0, 408, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 1, '2026-08-16 15:31:32', '2026-08-17 00:37:00'),
(8, 'test101', NULL, 'Liaquat Ali', 'Live Long', NULL, 0, 100, 0, 0, 100, 0, 0, 0, '', '18%', 'Pieces', NULL, NULL, 0, 0, 1, 1, '2026-08-17 00:39:43', '2026-08-17 00:39:43');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `fbr_invoice_number` varchar(50) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_ntn_cnic` varchar(20) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `customer_registration_type` varchar(20) DEFAULT NULL,
  `sale_date` datetime DEFAULT current_timestamp(),
  `total_amount` float DEFAULT NULL,
  `discount_amount` float DEFAULT NULL,
  `tax_amount` float DEFAULT NULL,
  `grand_total` float DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `fbr_status` varchar(20) DEFAULT NULL,
  `fbr_status_code` varchar(10) DEFAULT NULL,
  `fbr_error_code` varchar(10) DEFAULT NULL,
  `fbr_error_message` text DEFAULT NULL,
  `fbr_task_id` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `invoice_number`, `fbr_invoice_number`, `customer_name`, `customer_ntn_cnic`, `customer_phone`, `customer_address`, `customer_registration_type`, `sale_date`, `total_amount`, `discount_amount`, `tax_amount`, `grand_total`, `payment_method`, `payment_status`, `fbr_status`, `fbr_status_code`, `fbr_error_code`, `fbr_error_message`, `fbr_task_id`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'INV-20260816-EBB4FB', NULL, 'liaquatr', NULL, '0322-1234567', NULL, 'Unregistered', '2026-08-16 16:05:27', 210, 0, 37.8, 247.8, 'Cash', 'Paid', 'Pending', NULL, NULL, NULL, NULL, 'Completed', 2, '2026-08-16 16:05:27', '2026-08-16 16:05:27'),
(2, 'INV-20260816-6FBE52', NULL, 'Liaquat', NULL, '0300-1234567', NULL, 'Unregistered', '2026-08-16 16:10:48', 210, 0, 37.8, 247.8, 'Cash', 'Paid', 'Pending', NULL, NULL, NULL, NULL, 'Completed', 2, '2026-08-16 16:10:48', '2026-08-16 16:10:48');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `hs_code` varchar(20) DEFAULT NULL,
  `tax_rate` varchar(20) DEFAULT NULL,
  `uom` varchar(50) DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `unit_price` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `tax_amount` float DEFAULT NULL,
  `total_amount` float DEFAULT NULL,
  `fbr_item_status` varchar(20) DEFAULT NULL,
  `fbr_item_error_code` varchar(10) DEFAULT NULL,
  `fbr_item_error_message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `product_name`, `sku`, `hs_code`, `tax_rate`, `uom`, `quantity`, `unit_price`, `discount`, `tax_amount`, `total_amount`, `fbr_item_status`, `fbr_item_error_code`, `fbr_item_error_message`) VALUES
(1, 1, 7, 'Testing2 testing Product', 'prince of dhump', NULL, '18%', NULL, 1, 210, 0, 37.8, 247.8, NULL, NULL, NULL),
(2, 2, 7, 'Testing2 testing Product', 'prince of dhump', NULL, '18%', NULL, 1, 210, 0, 37.8, 247.8, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'admin', 'admin@example.com', '$2b$12$0rhkQQ8z3UK.N4n2GCRmku3xTJzp5J4ItRHGcp3Qo/lcjdFyPLxX.', NULL, 'user', 1, '2026-08-16 14:45:03', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_products_sku` (`sku`),
  ADD UNIQUE KEY `barcode` (`barcode`),
  ADD KEY `ix_products_id` (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_sales_invoice_number` (`invoice_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `ix_sales_id` (`id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `ix_sale_items_id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_username` (`username`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `ix_users_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
