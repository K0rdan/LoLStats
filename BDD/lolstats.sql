-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 14, 2016 at 01:14 PM
-- Server version: 5.5.47-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lolstats`
--

-- --------------------------------------------------------

--
-- Table structure for table `champions`
--

CREATE TABLE `champions` (
  `id` int(11) NOT NULL,
  `staticID` int(11) NOT NULL,
  `name` text NOT NULL,
  `nameKR` text NOT NULL,
  `role1` int(11) NOT NULL,
  `role2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `champions`
--

INSERT INTO `champions` (`id`, `staticID`, `name`, `nameKR`, `role1`, `role2`) VALUES
(1, 266, 'Aatrox', '아트록스', 2, 6),
(2, 103, 'Ahri', '아리', 3, 1),
(3, 84, 'Akali', '아칼리', 1, 7),
(4, 12, 'Alistar', '알리스타', 6, 7),
(5, 32, 'Amumu', '아무무', 6, 3),
(6, 34, 'Anivia', '애니비아', 3, 5),
(7, 1, 'Annie', '애니', 3, 7),
(8, 22, 'Ashe', '애쉬', 4, 5),
(9, 268, 'Azir', '아지르', 3, 4),
(10, 53, 'Blitzcrank', '블리츠크랭크', 6, 2),
(11, 63, 'Brand', '브랜드', 3, 7),
(12, 201, 'Braum', '브라움', 5, 6),
(13, 51, 'Caitlyn', '케이틀린', 4, 7),
(14, 69, 'Cassiopeia', '카시오페아', 3, 7),
(15, 31, 'Cho''Gath', '초가스', 6, 3),
(16, 42, 'Corki', '코르키', 4, 7),
(17, 122, 'Darius', '다리우스', 2, 6),
(18, 131, 'Diana', '다이애나', 2, 3),
(19, 36, 'Dr. Mundo', '문도 박사', 2, 6),
(20, 119, 'Draven', '드레이븐', 4, 7),
(21, 60, 'Elise', '엘리스', 3, 2),
(22, 28, 'Evelynn', '이블린', 1, 3),
(23, 81, 'Ezreal', '이즈리얼', 4, 3),
(24, 9, 'Fiddlesticks', '피들스틱', 3, 5),
(25, 114, 'Fiora', '피오라', 2, 1),
(26, 105, 'Fizz', '피즈', 1, 2),
(27, 3, 'Galio', '갈리오', 6, 3),
(28, 41, 'Gangplank', '갱플랭크', 2, 5),
(29, 86, 'Garen', '가렌', 2, 6),
(30, 150, 'Gnar', '나르', 2, 4),
(31, 79, 'Gragas', '그라가스', 2, 3),
(32, 104, 'Graves', '그레이브즈', 4, 7),
(33, 120, 'Hecarim', '헤카림 ', 2, 6),
(34, 74, 'Heimerdinger', '하이머딩거', 3, 5),
(35, 39, 'Irelia', '이렐리아', 2, 1),
(36, 40, 'Janna', '잔나', 5, 3),
(37, 59, 'Jarvan IV', '자르반 4세', 6, 2),
(38, 24, 'Jax', '잭스', 2, 1),
(39, 126, 'Jayce', '제이스', 2, 4),
(40, 222, 'Jinx', '징크스', 4, 7),
(41, 43, 'Karma', '카르마', 3, 5),
(42, 30, 'Karthus', '카서스', 3, 7),
(43, 38, 'Kassadin', '카사딘', 1, 3),
(44, 55, 'Katarina', '카타리나', 1, 3),
(45, 10, 'Kayle', '케일', 2, 5),
(46, 85, 'Kennen', '케넨', 3, 4),
(47, 121, 'Kha''Zix', '카직스', 1, 2),
(48, 96, 'Kog''Maw', '코그모', 4, 3),
(49, 7, 'LeBlanc', '르블랑', 1, 3),
(50, 64, 'Lee Sin', '리 신', 2, 1),
(51, 89, 'Leona', '레오나', 6, 5),
(52, 127, 'Lissandra', '리산드라', 3, 7),
(53, 236, 'Lucian', '루시안', 4, 7),
(54, 117, 'Lulu', '룰루', 5, 3),
(55, 99, 'Lux', '럭스', 3, 5),
(56, 54, 'Malphite', '말파이트', 6, 2),
(57, 90, 'Malzahar', '말자하', 3, 1),
(58, 57, 'Maokai', '마오카이', 6, 3),
(59, 11, 'Master Yi', '마스터 이', 1, 2),
(60, 21, 'Miss Fortune', '미스 포츈', 4, 7),
(61, 82, 'Mordekaiser', '오공', 2, 3),
(62, 25, 'Morgana', '모데카이저', 3, 5),
(63, 267, 'Nami', '모르가나', 5, 3),
(64, 75, 'Nasus', '나미', 2, 6),
(65, 111, 'Nautilus', '나서스', 6, 2),
(66, 76, 'Nidalee', '노틸러스', 1, 2),
(67, 56, 'Nocturne', '니달리', 1, 2),
(68, 20, 'Nunu', '녹턴', 5, 2),
(69, 2, 'Olaf', '누누', 2, 6),
(70, 61, 'Orianna', '올라프', 3, 5),
(71, 80, 'Pantheon', '오리아나', 2, 1),
(72, 78, 'Poppy', '판테온', 2, 1),
(73, 133, 'Quinn', '뽀삐', 4, 2),
(74, 33, 'Rammus', '퀸', 6, 2),
(75, 58, 'Renekton', '람머스', 2, 6),
(76, 107, 'Rengar', '레넥톤', 1, 2),
(77, 92, 'Riven', '렝가', 2, 1),
(78, 68, 'Rumble', '리븐', 2, 3),
(79, 13, 'Ryze', '럼블', 3, 2),
(80, 113, 'Sejuani', '라이즈', 6, 2),
(81, 35, 'Shaco', '세주아니', 1, 7),
(82, 98, 'Shen', '샤코', 6, 2),
(83, 102, 'Shyvana', '쉔', 2, 6),
(84, 27, 'Singed', '쉬바나', 6, 2),
(85, 14, 'Sion', '신지드', 2, 3),
(86, 15, 'Sivir', '사이온', 4, 7),
(87, 72, 'Skarner', '시비르', 2, 6),
(88, 37, 'Sona', '스카너', 5, 3),
(89, 16, 'Soraka', '소나', 5, 3),
(90, 50, 'Swain', '소라카', 3, 2),
(91, 134, 'Syndra', '스웨인', 3, 5),
(92, 91, 'Talon', '신드라', 1, 2),
(93, 44, 'Taric', '탈론', 5, 2),
(94, 17, 'Teemo', '타릭', 4, 1),
(95, 412, 'Thresh', '쓰레쉬', 5, 2),
(96, 18, 'Tristana', '티모', 4, 1),
(97, 48, 'Trundle', '트리스타나', 2, 6),
(98, 23, 'Tryndamere', '트런들', 2, 1),
(99, 4, 'Twisted Fate', '트린다미어', 3, 7),
(100, 29, 'Twitch', '트위스티드 페이트', 4, 1),
(101, 77, 'Udyr', '트위치', 2, 6),
(102, 6, 'Urgot', '우디르', 4, 6),
(103, 110, 'Varus', '우르곳', 4, 3),
(104, 67, 'Vayne', '바루스', 4, 1),
(105, 45, 'Veigar', '베인', 3, 7),
(106, 161, 'Vel''Koz', '베이가', 3, 7),
(107, 254, 'Vi', '벨코즈', 2, 1),
(108, 112, 'Viktor', '바이', 3, 7),
(109, 8, 'Vladimir', '빅토르', 3, 6),
(110, 106, 'Volibear', '블라디미르', 2, 6),
(111, 19, 'Warwick', '볼리베어', 2, 6),
(112, 62, 'Wukong', '워윅', 2, 6),
(113, 101, 'Xerath', '제라스', 3, 1),
(114, 5, 'Xin Zhao', '신 짜오', 2, 1),
(115, 157, 'Yasuo', '야스오', 2, 1),
(116, 83, 'Yorick', '요릭', 2, 3),
(117, 154, 'Zac', '자크', 6, 2),
(118, 238, 'Zed', '제드', 1, 2),
(119, 115, 'Ziggs', '직스', 3, 7),
(120, 26, 'Zilean', '질리언', 5, 3),
(121, 143, 'Zyra', '자이라', 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `lastQuery`
--

CREATE TABLE `lastQuery` (
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lastQuery`
--

INSERT INTO `lastQuery` (`date`) VALUES
('2015-04-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Assassin'),
(2, 'Fighter'),
(3, 'Mage'),
(4, 'Marksman'),
(5, 'Support'),
(6, 'Tank'),
(7, 'N/A');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `champions`
--
ALTER TABLE `champions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role1` (`role1`),
  ADD KEY `role2` (`role2`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `champions`
--
ALTER TABLE `champions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `champions`
--
ALTER TABLE `champions`
  ADD CONSTRAINT `fk_champions_role` FOREIGN KEY (`role1`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `fk_champions_role2` FOREIGN KEY (`role2`) REFERENCES `roles` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
