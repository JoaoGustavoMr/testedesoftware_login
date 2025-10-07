-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07-Out-2025 às 20:18
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `teste_software_db`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `criado_em`) VALUES
(1, 'Luis Zubeldia', 'joaogustavo2202@gmail.com', '$2y$10$pZe4TSz6BiCCtyfq.RV/VeMA0ZJ4wFyMGf8hTucUPeTVt2xngIQoq', '2025-10-07 16:47:25'),
(2, 's', 'sss@f', '$2y$10$wMiv1vRqe5f3WtiBNhFUceqyv7MwvyEcPYzEign2uCRhjxDRck0ri', '2025-10-07 16:56:58'),
(3, 'Potao', 'potao@gmail.com', '$2y$10$6W.lzDpqYKnREKMD03H0FuhEQ9734pkXEK/Q71mLGJVQxwa6qj0.y', '2025-10-07 16:57:13'),
(4, 'Mamute', 'mamute@gmail.com', '$2y$10$QTN8Yco409ozveODwm9T6.Np.mnZsj89gijyvBksFbAkUebrO85C.', '2025-10-07 17:02:46'),
(5, 'Kaique', 'kaique@gmail.com', '$2y$10$iHcUDksY.DggLr77599lHO.VC4o39CtE2dTeqgrJ5KpIDBj77dxt2', '2025-10-07 17:17:04'),
(6, 'Lauro', 'lauro@gmail.com', '$2y$10$a1Hb4l/jRI2fm9DJQ2fEB.yIZjaxGcEc1AgfmUJoz1CKkF9JfxWu.', '2025-10-07 17:17:24'),
(7, 'Calleri', 'calleri@gmail.com', '$2y$10$7s.lLlZRB9xBjzWtsp7Y8eaz2XP6hIjgBy2gNcEUucF9mHeSQl0Mu', '2025-10-07 17:21:39'),
(9, 'Luciano', 'luciano@gmail.com', '$2y$10$r0t44hPlcGeAhFouxt2AKu7EgWMot32z4sSaP3CDzmYHuVXkacVxW', '2025-10-07 18:15:45');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
