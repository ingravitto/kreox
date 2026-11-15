<?php
// Acceso al panel. Máximo 5 intentos fallidos cada 15 minutos por conexión.
if (user()) redirect(url('inicio'));

$error = '';
$espera = login_blocked();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    if ($espera > 0) {
        $error = 'Demasiados intentos. Espera ' . ceil($espera / 60) . ' minutos.';
    } else {
        $u = strtolower(trim((string) ($_POST['usuario'] ?? '')));
        $p = (string) ($_POST['clave'] ?? '');
        if (check_password($u, $p)) { login_ok($u); redirect(url('inicio')); }
        login_failed();
        $error = 'Usuario o contraseña incorrectos.';
    }
}

layout_start('Entrar');
?>
<section class="card narrow login">
  <div class="login-band"><img src="/panel/assets/kreox-logo-blanco.png" alt="KREOX" width="123" height="30"></div>
  <h1>Panel de la web</h1>
  <?php if ($error): ?><p class="flash flash--error" role="alert"><?= e($error) ?></p><?php endif; ?>
  <form method="post" action="<?= e(url('entrar')) ?>" class="form">
    <?= csrf_field() ?>
    <label>Usuario <input name="usuario" autocomplete="username" required autofocus></label>
    <label>Contraseña <input name="clave" type="password" autocomplete="current-password" required></label>
    <button class="btn btn--sand" type="submit">Entrar</button>
  </form>
</section>
<?php layout_end();
