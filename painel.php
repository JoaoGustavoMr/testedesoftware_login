<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Painel</title><link rel="stylesheet" href="style.css"></head>
<body>
<div class="container">
    <h2>Bem-vindo, <?= htmlspecialchars($_SESSION['usuario_nome'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>!</h2>
</div>
</body>
</html>
