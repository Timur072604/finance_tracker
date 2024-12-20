-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 16 2024 г., 18:10
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `budget-tracker`
--

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`, `userId`) VALUES
(1, 'Категория1', 'Cincelor'),
(2, 'Категория2', 'Cincelor'),
(3, 'Категория3', 'Cincelor'),
(4, 'Категория4', 'Cincelor');

-- --------------------------------------------------------

--
-- Структура таблицы `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `userId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `transactions`
--

INSERT INTO `transactions` (`id`, `date`, `title`, `amount`, `type`, `category`, `userId`) VALUES
(1, '2024-12-01', 'Транзакция1', 1000.00, 'income', 'Категория1', 'Cincelor'),
(2, '2024-12-02', 'Транзакция2', 2000.00, 'income', 'Категория1', 'Cincelor'),
(3, '2024-12-03', 'Транзакция3', 500.00, 'expense', 'Категория1', 'Cincelor'),
(4, '2024-12-04', 'Транзакция4', 1500.00, 'expense', 'Категория1', 'Cincelor'),
(5, '2024-12-05', 'Транзакция5', 3000.00, 'income', 'Категория2', 'Cincelor'),
(6, '2024-12-06', 'Транзакция6', 4000.00, 'income', 'Категория2', 'Cincelor'),
(7, '2024-12-07', 'Транзакция7', 2500.00, 'expense', 'Категория2', 'Cincelor'),
(8, '2024-12-08', 'Транзакция8', 3500.00, 'expense', 'Категория2', 'Cincelor'),
(9, '2024-12-09', 'Транзакция9', 5000.00, 'income', 'Категория3', 'Cincelor'),
(10, '2024-12-10', 'Транзакция10', 6000.00, 'income', 'Категория3', 'Cincelor'),
(11, '2024-12-11', 'Транзакция11', 4500.00, 'expense', 'Категория3', 'Cincelor'),
(12, '2024-12-12', 'Транзакция12', 5500.00, 'expense', 'Категория3', 'Cincelor'),
(13, '2024-12-13', 'Транзакция13', 7000.00, 'income', 'Категория4', 'Cincelor'),
(14, '2024-12-14', 'Транзакция14', 8000.00, 'income', 'Категория4', 'Cincelor'),
(15, '2024-12-15', 'Транзакция15', 7500.00, 'expense', 'Категория4', 'Cincelor'),
(16, '2024-12-16', 'Транзакция16', 8500.00, 'expense', 'Категория4', 'Cincelor');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Cincelor', 'Cincelor@mail.ru', 'Cincelor$1'),
(2, 'Unexpected', 'Unexpected@mail.ru', 'Unexpected$1');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
