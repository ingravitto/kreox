<?php
// Genera /panel/_config.php en el job de despliegue a partir de los GitHub Secrets (nunca se guarda en el repositorio
// ni en el artefacto de la construcción). Las contraseñas se guardan cifradas (password_hash).
//
// Variables de entorno:
//   PANEL_USERS         una línea por usuario: "usuario:contraseña"
//   PANEL_GITHUB_TOKEN  token "fine-grained" con Contents y Actions en lectura y escritura sobre el repositorio
//   GOOGLE_SA_JSON      clave JSON de la cuenta de servicio de Google (Analytics + Search Console)
//   GA4_PROPERTY_ID     ID numérico de la propiedad de Google Analytics 4
//   GSC_SITE            propiedad de Search Console, p. ej. "sc-domain:kreox.es"
//   DESTINO             pruebas | produccion (a dónde publica el panel)
//   REPO                owner/repo

$users = [];
foreach (preg_split('/\r?\n/', (string) getenv('PANEL_USERS')) as $line) {
    $line = trim($line);
    if ($line === '' || strpos($line, ':') === false) continue;
    [$u, $p] = explode(':', $line, 2);
    $u = strtolower(trim($u));
    if ($u === '' || strlen($p) < 10) { fwrite(STDERR, "Usuario del panel ignorado (la contraseña debe tener al menos 10 caracteres)\n"); continue; }
    $users[$u] = password_hash($p, PASSWORD_DEFAULT);
}
$destino = getenv('DESTINO') === 'produccion' ? 'produccion' : 'pruebas';
$cfg = [
    'users' => $users,
    'github' => [
        'token' => (string) getenv('PANEL_GITHUB_TOKEN'),
        'repo' => (string) (getenv('REPO') ?: 'ingravitto/kreox'),
        'branch' => 'main',
        'workflow' => 'deploy.yml',
        'destino' => $destino,
        'dispatch' => true,
    ],
    'google' => [
        'service_account' => (string) getenv('GOOGLE_SA_JSON'),
        'ga4_property' => preg_replace('/\D/', '', (string) getenv('GA4_PROPERTY_ID')),
        'gsc_site' => (string) (getenv('GSC_SITE') ?: 'sc-domain:kreox.es'),
    ],
    'site_url' => $destino === 'produccion' ? 'https://kreox.es' : 'https://nuevo.kreox.es',
];
echo "<?php\n// Generado en el despliegue. No editar: se sobrescribe en cada publicación.\nreturn " . var_export($cfg, true) . ";\n";
fwrite(STDERR, 'Panel: ' . count($users) . " usuario(s), destino $destino, GitHub " . ($cfg['github']['token'] ? 'sí' : 'NO') . ', Google ' . ($cfg['google']['service_account'] ? 'sí' : 'no') . "\n");
