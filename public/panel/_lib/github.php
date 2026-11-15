<?php
// Cliente mínimo de la API de GitHub para el panel: leer archivos, guardar varios en un solo commit
// y lanzar el despliegue (workflow "Construir y publicar").

declare(strict_types=1);

final class GitHubError extends RuntimeException {}

final class GitHub
{
    private $token;
    private $repo;
    private $branch;
    private $base;

    public function __construct(array $cfg)
    {
        $this->base = rtrim((string) ($cfg['api'] ?? 'https://api.github.com'), '/');
        $this->token = (string) $cfg['token'];
        $this->repo = (string) $cfg['repo'];
        $this->branch = (string) $cfg['branch'];
        if ($this->token === '') throw new GitHubError('Falta el token de GitHub (secreto PANEL_GITHUB_TOKEN).');
    }

    public function branch(): string { return $this->branch; }

    /** Petición a la API. Devuelve [código, cuerpo decodificado]. */
    public function api(string $method, string $path, $body = null): array
    {
        $ch = curl_init($this->base . $path);
        $headers = [
            'Authorization: Bearer ' . $this->token,
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: kreox-panel',
        ];
        if ($body !== null) $headers[] = 'Content-Type: application/json';
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
        ]);
        if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        $raw = curl_exec($ch);
        if ($raw === false) {
            $err = curl_error($ch);
            curl_close($ch);
            throw new GitHubError('No se pudo conectar con GitHub: ' . $err);
        }
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return [$code, $raw === '' ? null : json_decode((string) $raw, true)];
    }

    private function ok(array $r, string $what): array
    {
        [$code, $data] = $r;
        if ($code >= 200 && $code < 300) return is_array($data) ? $data : [];
        $msg = is_array($data) && isset($data['message']) ? $data['message'] : 'HTTP ' . $code;
        if ($code === 401) $msg = 'el token de GitHub no es válido o ha caducado';
        if ($code === 403 || $code === 404) $msg .= ' (revisa que el token tenga permiso de lectura y escritura en ' . $this->repo . ')';
        throw new GitHubError($what . ': ' . $msg);
    }

    /** Contenido de un archivo de texto en la rama, o null si no existe. */
    public function read(string $path): ?string
    {
        [$code, $data] = $this->api('GET', '/repos/' . $this->repo . '/contents/' . $this->enc($path) . '?ref=' . rawurlencode($this->branch));
        if ($code === 404) return null;
        $data = $this->ok([$code, $data], 'Leer ' . $path);
        return base64_decode((string) ($data['content'] ?? ''));
    }

    /** Lista los archivos de una carpeta: [[name, path, sha], …] o [] si no existe. */
    public function listDir(string $path): array
    {
        [$code, $data] = $this->api('GET', '/repos/' . $this->repo . '/contents/' . $this->enc($path) . '?ref=' . rawurlencode($this->branch));
        if ($code === 404) return [];
        $data = $this->ok([$code, $data], 'Listar ' . $path);
        return array_values(array_filter($data, function ($f) { return ($f['type'] ?? '') === 'file'; }));
    }

    /** Lee varios archivos en paralelo. Devuelve [path => contenido]. */
    public function readMany(array $paths): array
    {
        $mh = curl_multi_init();
        $handles = [];
        foreach ($paths as $p) {
            $ch = curl_init($this->base . '/repos/' . $this->repo . '/contents/' . $this->enc($p) . '?ref=' . rawurlencode($this->branch));
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $this->token, 'Accept: application/vnd.github.raw+json', 'X-GitHub-Api-Version: 2022-11-28', 'User-Agent: kreox-panel'],
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[$p] = $ch;
        }
        do { $st = curl_multi_exec($mh, $running); if ($running) curl_multi_select($mh, 1.0); } while ($running && $st === CURLM_OK);
        $out = [];
        foreach ($handles as $p => $ch) {
            if ((int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE) === 200) $out[$p] = (string) curl_multi_getcontent($ch);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
        curl_multi_close($mh);
        return $out;
    }

    /**
     * Guarda varios archivos en un único commit.
     * $files: [path => ['text' => string] | ['binary' => string] | null (borrar)]
     */
    public function commit(array $files, string $message): string
    {
        for ($try = 0; $try < 2; $try++) {
            $ref = $this->ok($this->api('GET', '/repos/' . $this->repo . '/git/ref/heads/' . $this->enc($this->branch)), 'Leer la rama');
            $head = $ref['object']['sha'];
            $commit = $this->ok($this->api('GET', '/repos/' . $this->repo . '/git/commits/' . $head), 'Leer el último commit');
            $tree = [];
            foreach ($files as $path => $f) {
                if ($f === null) { $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => null]; continue; }
                if (isset($f['binary'])) {
                    $blob = $this->ok($this->api('POST', '/repos/' . $this->repo . '/git/blobs', ['content' => base64_encode($f['binary']), 'encoding' => 'base64']), 'Subir ' . $path);
                    $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => $blob['sha']];
                } else {
                    $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'content' => (string) $f['text']];
                }
            }
            $newTree = $this->ok($this->api('POST', '/repos/' . $this->repo . '/git/trees', ['base_tree' => $commit['tree']['sha'], 'tree' => $tree]), 'Preparar el commit');
            $author = ['name' => 'Panel KREOX (' . (user() ?? 'panel') . ')', 'email' => 'panel@kreox.es', 'date' => gmdate('c')];
            $new = $this->ok($this->api('POST', '/repos/' . $this->repo . '/git/commits', ['message' => $message, 'tree' => $newTree['sha'], 'parents' => [$head], 'author' => $author]), 'Crear el commit');
            [$code, $data] = $this->api('PATCH', '/repos/' . $this->repo . '/git/refs/heads/' . $this->enc($this->branch), ['sha' => $new['sha'], 'force' => false]);
            if ($code >= 200 && $code < 300) return (string) $new['sha'];
            if ($code !== 422) $this->ok([$code, $data], 'Guardar en la rama');
            // 422: alguien guardó a la vez; se reintenta sobre el nuevo estado
        }
        throw new GitHubError('Otra persona ha guardado cambios a la vez. Vuelve a intentarlo.');
    }

    /** Lanza el workflow de publicación. */
    public function dispatch(string $workflow, string $destino): void
    {
        $this->ok($this->api('POST', '/repos/' . $this->repo . '/actions/workflows/' . rawurlencode($workflow) . '/dispatches', ['ref' => $this->branch, 'inputs' => ['destino' => $destino]]), 'Lanzar la publicación');
    }

    /** Últimas publicaciones (ejecuciones lanzadas a mano o desde el panel). */
    public function runs(string $workflow, int $n = 8): array
    {
        $d = $this->ok($this->api('GET', '/repos/' . $this->repo . '/actions/workflows/' . rawurlencode($workflow) . '/runs?event=workflow_dispatch&per_page=' . $n), 'Leer publicaciones');
        return $d['workflow_runs'] ?? [];
    }

    /** Últimos commits que tocan una ruta. */
    public function history(string $path, int $n = 10): array
    {
        return $this->ok($this->api('GET', '/repos/' . $this->repo . '/commits?sha=' . rawurlencode($this->branch) . '&path=' . rawurlencode($path) . '&per_page=' . $n), 'Leer historial');
    }

    private function enc(string $path): string { return implode('/', array_map('rawurlencode', explode('/', $path))); }
}

function github(): GitHub { return new GitHub(config()['github']); }

/** Guarda y, si está activado, publica. Devuelve el mensaje para el usuario. */
function save_and_publish(array $files, string $message): string
{
    $gh = github();
    $gh->commit($files, $message . "\n\nDesde el panel de kreox.es");
    $cfg = config()['github'];
    if (!empty($cfg['dispatch'])) {
        $gh->dispatch($cfg['workflow'], $cfg['destino']);
        return 'Guardado. La web se está publicando: estará al día en 2-3 minutos.';
    }
    return 'Guardado (publicación automática desactivada).';
}
