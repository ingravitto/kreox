<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $_SESSION = [];
    session_regenerate_id(true);
    session_destroy();
}
redirect(url('entrar'));
