<?php
require 'conexao.php';
require 'helpers.php';

$mensagem = "";
$tipo = "";
$csrf = gerar_csrf_token();

// simples rate limiting por sessão (ex.: 5 tentativas em 5 minutos)
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['first_attempt_time'] = time();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!verificar_csrf_token($_POST['csrf_token'] ?? '')) {
        $mensagem = "Requisição inválida (CSRF).";
        $tipo = "error";
    } else {
        // Verifica rate limiting
        $window = 300; // segundos (5 minutos)
        $maxAttempts = 5;
        if (time() - ($_SESSION['first_attempt_time'] ?? 0) > $window) {
            $_SESSION['login_attempts'] = 0;
            $_SESSION['first_attempt_time'] = time();
        }

        if ($_SESSION['login_attempts'] >= $maxAttempts) {
            $mensagem = "Muitas tentativas. Aguarde alguns minutos.";
            $tipo = "error";
        } else {
            $email = trim($_POST['email'] ?? '');
            $senha_raw = $_POST['senha'] ?? '';

            if ($email === '' || $senha_raw === '') {
                $mensagem = "Preencha todos os campos.";
                $tipo = "warning";
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $mensagem = "Credenciais inválidas.";
                $tipo = "warning";
            } else {
                $stmt = $conn->prepare("SELECT id, nome, senha FROM usuarios WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $res = $stmt->get_result();

                if ($res && $res->num_rows === 1) {
                    $usuario = $res->fetch_assoc();
                    if (password_verify($senha_raw, $usuario['senha'])) {
                        // Sucesso de login: regenerar id de sessão e reset attempts
                        session_regenerate_id(true);
                        $_SESSION['usuario_id'] = $usuario['id'];
                        $_SESSION['usuario_nome'] = $usuario['nome'];
                        $_SESSION['login_attempts'] = 0;
                        $mensagem = "Login realizado com sucesso!";
                        $tipo = "success";
                    } else {
                        $_SESSION['login_attempts'] += 1;
                        $mensagem = "Credenciais inválidas.";
                        $tipo = "error";
                    }
                } else {
                    // não revelar se email existe
                    $_SESSION['login_attempts'] += 1;
                    $mensagem = "Credenciais inválidas.";
                    $tipo = "error";
                }
                $stmt->close();
            }
            $conn->close();
        }
    }
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Login</title>
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<div class="container">
    <h2>Login</h2>
    <form id="formLogin" method="post" novalidate>
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
        <label>Email:</label>
        <input type="email" name="email" id="email" required>
        <label>Senha:</label>
        <input type="password" name="senha" id="senha" required>
        <button type="submit">Entrar</button>
    </form>
    <a href="cadastro.php">Criar nova conta</a>
</div>

<script>
document.getElementById('formLogin').addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    if (!email || !senha) {
        Swal.fire({ icon: 'warning', title: 'Campo vazio', text: 'Preencha todos os campos.' });
        return;
    }
    this.submit();
});
</script>

<?php if (!empty($mensagem)): ?>
<script>
Swal.fire({
    icon: <?= js_string($tipo) ?>,
    title: <?= js_string($tipo === 'success' ? 'Bem-vindo!' : 'Aviso') ?>,
    text: <?= js_string($mensagem) ?>,
    confirmButtonText: 'OK'
}).then(() => {
    <?php if ($tipo === 'success'): ?>
        window.location.href = 'painel.php';
    <?php endif; ?>
});
</script>
<?php endif; ?>
</body>
</html>
