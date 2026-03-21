<?php
// Cargar variables de entorno desde .env
if (file_exists('.env')) {
    $envFile = file_get_contents('.env');
    foreach (explode("\n", $envFile) as $line) {
        $line = trim($line);
        if (!empty($line) && strpos($line, '#') !== 0 && strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// Configuración - IMPORTANTE: Usar .env para datos sensibles
$apiKey = getenv('WU_API_KEY');
$stationId = getenv('STATION_ID');

// Validar que las variables estén configuradas
if (!$apiKey || !$stationId) {
    http_response_code(500);
    die(json_encode(['error' => 'Variables de entorno no configuradas. Revisa .env']));
}

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Cache de 5 minutos
$cacheFile = 'cache.json';
if (file_exists($cacheFile) && time() - filemtime($cacheFile) < 300) {
    echo file_get_contents($cacheFile);
    exit;
}

// URL de la API
$url = "https://api.weather.com/v2/pws/observations/current?stationId={$stationId}&format=json&units=m&apiKey={$apiKey}";

// Realizar petición
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Guardar respuesta en cache
file_put_contents($cacheFile, $response);

echo $response;
?>
