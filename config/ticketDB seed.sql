INSERT INTO `users` (`user_id`, `email`, `password`, `first_name`, `last_name`, `address`, `address2`, `city`, `state`, `zip`, `createdAt`, `updatedAt`, `username`) VALUES
('d5b6440e-b4b9-11ee-9958-00163e1885ca', 'user1@example.com', '$2b$10$HcBh2ffEBt1RY.uPN/ugMuFgxroJcGuypN.u1epkrxqJzO17MCmvS', 'John', 'Doe', '123 Main St', 'Apt 45', 'City1', 'State1', '12345', '2023-12-06 00:49:19', '2024-01-16 09:13:30', ''),
('d5b65ec7-b4b9-11ee-9958-00163e1885ca', 'user2@example.com', 'password2', 'Jane', 'Smith', '456 Oak St', 'Unit 12', 'City2', 'State2', '67890', '2023-12-06 00:49:19', '2023-12-06 00:49:19', ''),
('d5b65fb8-b4b9-11ee-9958-00163e1885ca', 'princedee3@gmail.com', '$2b$10$TD1GXefM92zFGVdaAXJh3.jvfdrGDkOE0pydwfhyq.V3LbDifuIuC', 'emmanuel', 'meremikwu', NULL, NULL, 'lubbock', NULL, '12345', '2024-01-16 08:12:03', '2024-01-16 09:03:03', 'yxngboypolo');


INSERT INTO `ticket_types` (`type_id`, `name`, `number_count`, `constraint`, `price`, `description`, `running_total`, `disabled`, `createdAt`, `updatedAt`) VALUES
(1, 'Powerball', 5, '69:69:69:69:69:26', 2.00, 'Power Ball is a popular lottery game with a jackpot that starts at $20 million and increases until there is a winner. Draws are held every Wednesday and Saturday.', 0.00, 0, '2023-12-06 00:28:41', '2023-12-06 00:28:41'),
(2, 'Mega Millions', 6, '70:70:70:70:70:25', 2.00, 'Mega Millions is known for its record-breaking jackpots. It offers large prizes and a variety of ways to win. Draws take place every Tuesday and Friday.', 0.00, 0, '2023-12-06 00:28:41', '2023-12-06 00:28:41'),
(3, 'Lotto Texas', 6, '54:54:54:54:54:54', 1.00, 'Lotto Texas is a classic lottery game with a minimum jackpot of $5 million. It has drawings on Wednesdays and Saturdays.', 0.00, 0, '2023-12-06 00:28:41', '2023-12-06 00:28:41'),
(4, 'Texas Two Step', 4, '35:35:35:35:35', 1.50, 'Texas Two Step is a unique game with a guaranteed jackpot of $200,000. It involves selecting four numbers and a bonus ball. Draws are held on Mondays and Thursdays.', 0.00, 0, '2023-12-06 00:28:41', '2023-12-06 00:28:41');

INSERT INTO `tickets` (`ticket_id`, `ticket_reference_number`, `selected_numbers`, `ticket_type_id`, `createdAt`, `updatedAt`) VALUES
(181, 'tk:UA01-8d5af-2312-e945b', '01:02:03:04:05:07', 1, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(182, 'tk:UA01-8d5af-2312-80ff3', '06:05:04:03:02:06', 1, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(183, 'tk:UA01-8d5af-2312-19061', NULL, 1, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(184, 'tk:UA01-8d5af-2312-9d67e', NULL, 1, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(185, 'tk:UA01-8d5af-2312-f18f0', NULL, 1, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(186, 'tk:UA04-8d5af-2312-f3219', NULL, 4, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(187, 'tk:UA04-8d5af-2312-acc99', NULL, 4, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(188, 'tk:UA04-8d5af-2312-ee234', NULL, 4, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(189, 'tk:UA04-8d5af-2312-691e6', NULL, 4, '2023-12-14 07:55:42', '2024-01-09 15:06:09'),
(190, 'tk:UA03-8d5af-2312-c648b', NULL, 3, '2023-12-14 07:55:42', '2024-01-09 15:06:10'),
(191, 'tk:UA03-8d5af-2312-d2d09', NULL, 3, '2023-12-14 07:55:42', '2024-01-09 15:06:10'),
(192, 'tk:UA04-d2ab6-2312-e3d79', NULL, 4, '2023-12-14 20:05:16', '2024-01-09 15:06:10'),
(193, 'tk:UA04-d2ab6-2312-80697', NULL, 4, '2023-12-14 20:05:16', '2024-01-09 15:06:10'),
(194, 'tk:UA04-d2ab6-2312-2a833', NULL, 4, '2023-12-14 20:05:16', '2024-01-09 15:06:10'),
(195, 'tk:UA04-d2ab6-2312-a8df1', NULL, 4, '2023-12-14 20:05:16', '2024-01-09 15:06:10'),
(196, 'tk:UA04-b5369-2312-a9db4', NULL, 4, '2023-12-16 00:53:50', '2024-01-09 15:06:10'),
(197, 'tk:UA04-b5369-2312-7548c', NULL, 4, '2023-12-16 00:53:50', '2024-01-09 15:06:10'),
(198, 'tk:UA04-3d596-2312-14b20', NULL, 4, '2023-12-18 08:57:49', '2024-01-09 15:06:10'),
(199, 'tk:UA04-3d596-2312-14a17', '35:35:35:35:05', 4, '2023-12-18 08:57:49', '2024-01-09 15:06:10'),
(200, 'tk:UA04-908cc-2312-112a3', NULL, 4, '2023-12-25 05:45:03', '2024-01-09 15:06:10'),
(201, 'tk:UA04-908cc-2312-bc0df', NULL, 4, '2023-12-25 05:45:03', '2024-01-09 15:06:10'),
(202, 'tk:UA01-908cc-2312-8b58d', NULL, 1, '2023-12-25 05:45:03', '2024-01-09 15:06:10'),
(203, 'tk:UA03-908cc-2312-76940', NULL, 3, '2023-12-25 05:45:03', '2024-01-09 15:06:10'),
(210, 'tk:UA01-a9b9c-2401-59cc1', NULL, 1, '2024-01-09 05:44:41', '2024-01-09 05:44:41'),
(211, 'tk:UA01-a9b9c-2401-f6815', NULL, 1, '2024-01-09 05:44:41', '2024-01-09 05:44:41'),
(212, 'tk:UA01-a9b9c-2401-c7471', NULL, 1, '2024-01-09 05:44:41', '2024-01-09 05:44:41'),
(213, 'tk:UA02-a9b9c-2401-5249f', NULL, 2, '2024-01-09 05:44:41', '2024-01-09 05:44:41'),
(214, 'tk:UA03-a9b9c-2401-2e3cb', '35:35:35:35:06:10', 3, '2024-01-09 05:44:41', '2024-01-16 06:50:47'),
(215, 'tk:UA01-66fa0-2401-6bf08', '35:35:35:35:06:08', 1, '2024-01-09 05:57:13', '2024-01-09 15:31:32');

INSERT INTO `winning_tickets` (`winningTicket_id`, `reward_amount`, `selected_numbers`, `createdAt`, `updatedAt`, `ticket_id`) VALUES
(1, 1000000.00, '5:12:18:25:30', '2023-12-06 00:30:37', '2023-12-06 00:30:37', NULL),
(2, 500000.00, '2:15:22:28:31', '2023-12-06 00:30:37', '2023-12-06 00:30:37', NULL),
(3, 250000.00, '8:16:24:29:35', '2023-12-06 00:30:37', '2023-12-06 00:30:37', NULL),
(4, 100000.00, '3:10:17:23:32', '2023-12-06 00:30:37', '2023-12-06 00:30:37', NULL);

INSERT INTO `orders` (`order_id`, `date`, `subtotal`, `user_id`) VALUES
('5a4dec11-7ba9-4b4a-833b-7173982a9b9c', '2024-01-09 05:43:37', 9.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('83068dc7-5f18-48f7-afd4-4768e3d8d5af', '2023-12-14 07:55:42', 18.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('8875c2eb-95de-40ba-88a2-f6255883d596', '2023-12-18 08:57:48', 3.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('a798c78c-2fda-40e1-97ce-105b759b5369', '2023-12-16 00:53:50', 3.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('aa55faa6-d18f-4ec5-a608-7c4146d66fa0', '2024-01-09 05:57:09', 2.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('e615a3e5-0961-4eae-bd3e-873dbe1d2ab6', '2023-12-14 20:05:16', 6.00, 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
('fe37595f-6971-411d-af33-81770ac908cc', '2023-12-25 05:45:03', 6.00, 'd5b65ec7-b4b9-11ee-9958-00163e1885ca');

INSERT INTO `order_items` (`order_item_id`, `order_id`, `ticket_id`) VALUES
(131, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 181),
(132, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 182),
(133, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 183),
(134, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 184),
(135, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 185),
(136, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 186),
(137, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 187),
(138, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 188),
(139, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 189),
(140, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 190),
(141, '83068dc7-5f18-48f7-afd4-4768e3d8d5af', 191),
(142, 'e615a3e5-0961-4eae-bd3e-873dbe1d2ab6', 192),
(143, 'e615a3e5-0961-4eae-bd3e-873dbe1d2ab6', 193),
(144, 'e615a3e5-0961-4eae-bd3e-873dbe1d2ab6', 194),
(145, 'e615a3e5-0961-4eae-bd3e-873dbe1d2ab6', 195),
(146, 'a798c78c-2fda-40e1-97ce-105b759b5369', 196),
(147, 'a798c78c-2fda-40e1-97ce-105b759b5369', 197),
(148, '8875c2eb-95de-40ba-88a2-f6255883d596', 198),
(149, '8875c2eb-95de-40ba-88a2-f6255883d596', 199),
(150, 'fe37595f-6971-411d-af33-81770ac908cc', 200),
(151, 'fe37595f-6971-411d-af33-81770ac908cc', 201),
(152, 'fe37595f-6971-411d-af33-81770ac908cc', 202),
(153, 'fe37595f-6971-411d-af33-81770ac908cc', 203),
(160, '5a4dec11-7ba9-4b4a-833b-7173982a9b9c', 210),
(161, '5a4dec11-7ba9-4b4a-833b-7173982a9b9c', 211),
(162, '5a4dec11-7ba9-4b4a-833b-7173982a9b9c', 212),
(163, '5a4dec11-7ba9-4b4a-833b-7173982a9b9c', 213),
(164, '5a4dec11-7ba9-4b4a-833b-7173982a9b9c', 214),
(165, 'aa55faa6-d18f-4ec5-a608-7c4146d66fa0', 215);

INSERT INTO `cart` (`cart_id`, `createdAt`, `updatedAt`, `user_id`) VALUES
(1, '2023-12-13 03:02:25', '2023-12-13 03:02:25', 'd5b6440e-b4b9-11ee-9958-00163e1885ca'),
(2, '2023-12-13 03:02:25', '2023-12-13 03:02:25', 'd5b65ec7-b4b9-11ee-9958-00163e1885ca');

INSERT INTO `cart_items` (`cart_item_id`, `quantity`, `cart_id`, `ticket_type_id`) VALUES
(3, 3, 2, 3),
(23, 5, 1, 1),
(24, 1, 1, 2),
(25, 4, 1, 3);