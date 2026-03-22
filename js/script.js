// ============================================
// Convertir grados a dirección cardinal
// ============================================
function degreesToCardinal(degrees) {
    // Normalizar grados a 0-360
    degrees = degrees % 360;
    if (degrees < 0) degrees += 360;
    
    // Rosa de 16 vientos (22.5° por sector)
    const directions = [
        { label: 'N',   min: 348.75, max: 11.25 },
        { label: 'NNE', min: 11.25,  max: 33.75 },
        { label: 'NE',  min: 33.75,  max: 56.25 },
        { label: 'ENE', min: 56.25,  max: 78.75 },
        { label: 'E',   min: 78.75,  max: 101.25 },
        { label: 'ESE', min: 101.25, max: 123.75 },
        { label: 'SE',  min: 123.75, max: 146.25 },
        { label: 'SSE', min: 146.25, max: 168.75 },
        { label: 'S',   min: 168.75, max: 191.25 },
        { label: 'SSO', min: 191.25, max: 213.75 },
        { label: 'SO',  min: 213.75, max: 236.25 },
        { label: 'OSO', min: 236.25, max: 258.75 },
        { label: 'O',   min: 258.75, max: 281.25 },
        { label: 'ONO', min: 281.25, max: 303.75 },
        { label: 'NO',  min: 303.75, max: 326.25 },
        { label: 'NNO', min: 326.25, max: 348.75 }
    ];
    
    // Buscar el rango que contenga los grados
    for (let dir of directions) {
        if (dir.label === 'N') {
            // N es especial: puede ser 348.75-360 o 0-11.25
            if (degrees >= dir.min || degrees < 11.25) return dir.label;
        } else if (degrees >= dir.min && degrees < dir.max) {
            return dir.label;
        }
    }
    
    return 'N'; // Default
}

function updateWeather() {
    fetch('api.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Validar que los datos sean válidos
            if (!data.observations || !Array.isArray(data.observations) || data.observations.length === 0) {
                throw new Error('Datos inválidos: no hay observaciones');
            }

            const obs = data.observations[0];
            const metric = obs.metric;

            if (!metric) {
                throw new Error('Datos inválidos: no hay métricas');
            }
            
            // Actualizar valores
            document.getElementById('temperature').textContent = `${metric.temp}°C`;
            document.getElementById('feels-like').textContent = `${metric.heatIndex}°C`;
            document.getElementById('dew-point').textContent = `${metric.dewpt}°C`;
            document.getElementById('humidity').textContent = `${obs.humidity}%`;
            document.getElementById('pressure').textContent = `${metric.pressure} mb`;
            
            // Viento - Velocidad y Dirección separadas
            document.getElementById('wind-speed').textContent = `${metric.windSpeed} km/h`;
            const windDegrees = obs.winddir || 0;
            const windCardinal = degreesToCardinal(windDegrees);
            document.getElementById('wind-dir').textContent = `${windCardinal} (${windDegrees}°)`;
            
            // Precipitación
            let precip = '--';
            if (metric.precipAccum) {
                precip = `${metric.precipAccum} mm`;
            } else if (metric.precipTotal) {
                precip = `${metric.precipTotal} mm`;
            } else if (obs.imperial?.precipAccum) {
                precip = `${(obs.imperial.precipAccum * 25.4).toFixed(1)} mm`;
            }
            document.getElementById('precip').textContent = precip;
            
            // Timestamp
            const timestamp = new Date(obs.epoch * 1000).toLocaleString();
            document.getElementById('timestamp').textContent = `Última actualización: ${timestamp}`;
            
            // Limpiar indicador de error
            document.getElementById('statusIndicator').classList.remove('error');
        })
        .catch(error => {
            console.error('Error completo:', error);
            document.getElementById('timestamp').textContent = `Error: ${error.message}`;
            document.getElementById('statusIndicator').classList.add('error');
        });
}

// Actualizar datos cada 5 minutos
updateWeather();
setInterval(updateWeather, 300000);

// Función para actualizar manualmente (desde botón)
function refreshWeather() {
    const btn = document.querySelector('.refresh-btn i');
    if (btn) {
        btn.style.transform = 'rotate(180deg)';
    }
    updateWeather();
    setTimeout(() => {
        if (btn) {
            btn.style.transform = 'rotate(0deg)';
        }
    }, 1000);
}

// ============================================
// Inicializar Windy API para pronóstico
// ============================================
// Coordenadas: Veinticinco de Mayo, Buenos Aires, Argentina
if (typeof windyInit !== 'undefined') {
    try {
        const windyOptions = {
            key: 'jNBYXvK9Z6hWpfgzCwF6nYnw9nyklpLH', // API key de Windy (Map Forecast)
            verbose: false,
            lat: -35.425495,      // Veinticinco de Mayo
            lon: -60.168502,      // Buenos Aires
            zoom: 10,
            timestamp: new Date().getTime() / 1000
        };

        windyInit(windyOptions, windyAPI => {
            const { map } = windyAPI;
            // El mapa ya está inicializado y listo para usar
            // Leaflet y Windy están completamente funcionales
        });
    } catch (error) {
        console.error('Error inicializando Windy:', error);
    }
} else {
    console.warn('Windy API no está disponible');
}