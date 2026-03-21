# Estación Meteorológica Experimental LW9ERO

Dashboard meteorológico en tiempo real para la estación experimental ubicada en Veinticinco de Mayo, Buenos Aires.

## 🌤️ Características

- **8 módulos de datos meteorológicos:**
  - Temperatura actual
  - Sensación térmica
  - Punto de rocío
  - Humedad relativa
  - Presión atmosférica
  - Velocidad del viento
  - Dirección del viento
  - Precipitación acumulada

- **Interfaz moderna** con diseño responsivo
- **Actualización automática** cada 5 minutos
- **Caché local** para optimizar requests a la API
- **Botón de actualización manual** por si necesitas datos frescos

## 🏗️ Stack Técnico

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** PHP + cURL
- **API:** Weather.com (PWS API)
- **Base datos:** Caché JSON local

## 📁 Estructura del Proyecto

```
htdocs_web/
├── index.html           # Página principal
├── api.php             # Proxy PHP para API Weather.com
├── cache.json          # Caché de datos (generado automáticamente)
├── css/
│   └── style.css       # Estilos
├── js/
│   └── script.js       # Lógica de actualización
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- PHP 7.0+
- Servidor web (Apache, Nginx, etc.)
- Internet para acceder a Weather.com API

### Setup Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/weather-station-lw9ero.git
cd weather-station-lw9ero
```

2. **Configurar variables de entorno:**
```bash
export WU_API_KEY="tu-api-key-aqui"
```

O crear un archivo `.env` (no se versionará por `.gitignore`):
```
WU_API_KEY=tu-api-key-aqui
STATION_ID=IDEMAY12
```

3. **Colocar en la raíz web:**
```bash
cp -r htdocs_web/* /var/www/html/
```

4. **Acceder:**
Abre `http://localhost` (o tu servidor)

## 🔧 Configuración

En `api.php`:
- **`$apiKey`**: Se obtiene de la variable de entorno `WU_API_KEY`
- **`$stationId`**: ID de la estación Weather Underground (IDEMAY12)
- **`$cacheFile`**: Archivo de caché (cache.json)
- **Cache TTL**: 5 minutos (300 segundos)

En `js/script.js`:
- **Intervalo de actualización**: 5 minutos (300000 ms)
- Endpoint: `api.php`

## 📊 Datos de Respuesta

El archivo `cache.json` contiene la respuesta de la API con esta estructura:

```json
{
  "observations": [
    {
      "stationID": "IDEMAY12",
      "obsTimeUtc": "2026-03-21T20:00:00Z",
      "humidity": 72,
      "winddir": 45,
      "winddirCardinal": "NE",
      "metric": {
        "temp": 18,
        "heatIndex": 18,
        "dewpt": 13,
        "windSpeed": 12,
        "pressure": 999.73,
        "precipTotal": 7.62
      }
    }
  ]
}
```

## 🎨 Personalización

### Cambiar colores
En `css/style.css`, busca:
```css
.icon {
    color: #00bcd4;  /* Color cyan, cambiar aquí */
}
```

### Agregar más módulos
1. Agregar card HTML en `index.html`
2. Agregar elemento en `js/script.js` en la función `updateWeather()`

## 🐛 Troubleshooting

**Problema:** "Error al cargar datos"
- Verifica que `api.php` tenga permisos de ejecución
- Revisa que cURL esté instalado en PHP
- Valida que la API key sea correcta

**Problema:** Valores muestran "--"
- El caché puede estar vacío, presiona el botón de actualizar
- Revisa la consola del navegador (F12) para ver el error exacto

**Problema:** Datos no se actualizan
- Verifica el caché TTL en `api.php`
- Asegúrate de tener conexión a internet

## 📝 Licencia

MIT

## 👨‍💻 Autor

**LW9ERO Station**  
Veinticinco de Mayo, Buenos Aires, Argentina

---

**Última actualización:** Marzo 2026
