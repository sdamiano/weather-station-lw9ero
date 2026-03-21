function updateWeather() {
    fetch('api.php')
        .then(response => response.json())
        .then(data => {
            const obs = data.observations[0];
            const metric = obs.metric;
            
            // Actualizar valores
            document.getElementById('temperature').textContent = `${metric.temp}°C`;
            document.getElementById('feels-like').textContent = `${metric.heatIndex}°C`;
            document.getElementById('dew-point').textContent = `${metric.dewpt}°C`;
            document.getElementById('humidity').textContent = `${obs.humidity}%`;
            document.getElementById('pressure').textContent = `${metric.pressure} mb`;
            
            // Viento - Velocidad y Dirección separadas
            document.getElementById('wind-speed').textContent = `${metric.windSpeed} km/h`;
            const windDirection = obs.winddir || '--';
            const directionText = obs.winddirCardinal ? ` ${obs.winddirCardinal}` : '';
            document.getElementById('wind-dir').textContent = `${windDirection}°${directionText}`;
            
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
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('timestamp').textContent = 'Error al cargar datos';
        });
}

// Actualizar datos cada 5 minutos
updateWeather();
setInterval(updateWeather, 300000);