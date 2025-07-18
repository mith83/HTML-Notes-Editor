<?php
// assets/snippet.php
header('Content-Type: application/json');
$snipfile = __DIR__ . '/snippett.json';
$action = $_GET['action'] ?? '';
if ($action === 'read') {
    if (file_exists($snipfile)) {
        $json = file_get_contents($snipfile);
        echo $json ?: '[]';
    } else {
        echo '[]';
    }
    exit;
}
if ($action === 'write') {
    $data = file_get_contents('php://input');
    if ($data && is_array(json_decode($data, true))) {
        file_put_contents($snipfile, $data);
        echo '{"success":true}';
    } else {
        http_response_code(400);
        echo '{"success":false, "error":"Invalid data"}';
    }
    exit;
}
echo '{"success":false, "error":"Invalid action"}'; 