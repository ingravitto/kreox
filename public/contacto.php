<?php
// Formulario de contacto de kreox.es (hosting cPanel con PHP).
// Envía el mensaje al departamento comercial y redirige a /gracias/.
declare(strict_types=1);

const DESTINO = 'comercial@kreox.es';
const REMITENTE = 'web@kreox.es'; // Debe existir como cuenta o alias en el dominio para que el correo no acabe en spam.

function volver(string $ruta): void {
    header('Location: ' . $ruta, true, 303);
    exit;
}

function campo(string $nombre, int $max = 200): string {
    $v = trim((string)($_POST[$nombre] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v);
    return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    volver('/contacto/');
}

// Antispam: campo trampa relleno o envío en menos de 3 segundos.
$ts = (int)($_POST['ts'] ?? 0);
if (!empty($_POST['web']) || ($ts > 0 && time() - $ts < 3)) {
    volver('/gracias/');
}

$nombre    = campo('nombre', 120);
$empresa   = campo('empresa', 120);
$email     = campo('email', 160);
$telefono  = campo('telefono', 40);
$interes   = campo('interes', 40);
$mensaje   = mb_substr(trim((string)($_POST['mensaje'] ?? '')), 0, 3000);
$privacidad = ($_POST['privacidad'] ?? '') === '1';

$intereses = ['nivelacion' => 'Nivelación autonivelante', 'azulejos' => 'Colocación de azulejos', 'exportacion' => 'Distribución / exportación', 'otra' => 'Otra consulta'];

if ($nombre === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$privacidad) {
    volver('/contacto/?error=1');
}

$asunto = '[Web KREOX] Consulta · ' . ($intereses[$interes] ?? 'Sin especificar');
$cuerpo = "Nueva solicitud desde kreox.es\n\n"
    . "Nombre: $nombre\n"
    . "Empresa: $empresa\n"
    . "Email: $email\n"
    . "Teléfono: $telefono\n"
    . 'Interés: ' . ($intereses[$interes] ?? $interes) . "\n\n"
    . "Mensaje:\n$mensaje\n\n"
    . 'Aceptó la política de privacidad: sí · ' . date('d/m/Y H:i') . "\n";

$cabeceras = [
    'From: KREOX Web <' . REMITENTE . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: kreox-web',
];

$ok = mail(DESTINO, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, implode("\r\n", $cabeceras), '-f' . REMITENTE);

volver($ok ? '/gracias/' : '/contacto/?error=1');
