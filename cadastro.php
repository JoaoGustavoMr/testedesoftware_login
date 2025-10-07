<?php
require 'conexao.php';
require 'helpers.php';

$mensagem = "";
$tipo = "";
$csrf = gerar_csrf_token();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!verificar_csrf_token($_POST['csrf_token'] ?? '')) {
        $mensagem = "Requisição inválida (CSRF).";
        $tipo = "error";
    } else {
        $nome = limpa_input($_POST['nome'] ?? '');
        $email = limpa_input($_POST['email'] ?? '');
        $senha_raw = $_POST['senha'] ?? '';

        if ($nome === '' || $email === '' || $senha_raw === '') {
            $mensagem = "Preencha todos os campos.";
            $tipo = "warning";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $mensagem = "Email inválido.";
            $tipo = "warning";
        } elseif (strlen($senha_raw) < 6) {
            $mensagem = "Senha deve ter pelo menos 6 caracteres.";
            $tipo = "warning";
        } else {
            $senha = password_hash($senha_raw, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $nome, $email, $senha);
            if ($stmt->execute()) {
                $mensagem = "Cadastro realizado com sucesso!";
                $tipo = "success";
            } else {
                if ($stmt->errno === 1062) {
                    $mensagem = "Este email já está registrado.";
                } else {
                    $mensagem = "Erro ao cadastrar. Tente novamente.";
                }
                $tipo = "error";
            }
            $stmt->close();
        }
    }
    $conn->close();
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Cadastro</title>
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<div class="container">
    <h2>Cadastro</h2>
    <form id="formCadastro" method="post" novalidate>
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
        <label>Nome:</label>
        <input type="text" name="nome" id="nome" required>

        <label>Email:</label>
        <input type="email" name="email" id="email" required>

        <label>Senha:</label>
        <input type="password" name="senha" id="senha" required>

        <button type="submit">Cadastrar</button>
    </form>
    <a href="login.php">Já tem conta? Fazer login</a>
</div>

<script>
document.getElementById('formCadastro').addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        Swal.fire({ icon: 'warning', title: 'Campo vazio', text: 'Preencha todos os campos.' });
        return;
    }
    if (senha.length < 6) {
        Swal.fire({ icon: 'warning', title: 'Senha curta', text: 'A senha deve ter pelo menos 6 caracteres.' });
        return;
    }
    this.submit();
});
</script>

<?php if (!empty($mensagem)): ?>
<script>
Swal.fire({
    icon: <?= js_string($tipo) ?>,
    title: <?= js_string($tipo === 'success' ? 'Sucesso!' : 'Aviso') ?>,
    text: <?= js_string($mensagem) ?>,
    confirmButtonText: 'OK'
}).then(() => {
    <?php if ($tipo === 'success'): ?>
        window.location.href = 'login.php';
    <?php endif; ?>
});
</script>
<?php endif; ?>
</body>
</html>
