export function renderWeather(data) {
    // Handle potential missing data gracefully
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        console.error("Invalid weather data received");
        return;
    }

    // Wind data
    document.getElementById("wind").textContent = data.wind?.speed ? `${data.wind.speed} km/h` : "--";
    document.getElementById("wind-speed").textContent = data.wind?.speed ? `${data.wind.speed}` : "--";
    
    // Humidity
    document.getElementById("humidity-value").textContent = `${data.main.humidity}`;
    document.getElementById("humidity").textContent = `${data.main.humidity}`;
    
    // Visibility (convert from meters to kilometers)
    const visibilityKm = data.visibility ? (data.visibility / 1000).toFixed(1) : "--";
    document.getElementById("visibility-value").textContent = visibilityKm;
    document.getElementById("visibility").textContent = visibilityKm;
    
    // Pressure
    document.getElementById("pressure").textContent = `${data.main.pressure}`;
    document.getElementById("pressure-value").textContent = `${data.main.pressure}`;
    
    // Sunrise/Sunset - convert from Unix timestamp to readable time
    if (data.sys?.sunrise) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }
    
    if (data.sys?.sunset) {
        const sunset = new Date(data.sys.sunset * 1000);
        document.getElementById("sunset").textContent = sunset.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }
    
    // Temperature data
    document.getElementById("real-feel").textContent = `${Math.round(data.main.feels_like)}`;
    document.getElementById("current-condition").textContent = data.weather[0].main;
    document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}`;

    // Update location display with city and country
    const locationEl = document.getElementById("location");
    if (data.name && data.sys?.country) {
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
    }
}

export function renderForecast(daily) {
  daily.forEach((item, index) => {
    if (index >= 5) return; // only show 5 days

    // grab the right card by ID
    const dayNameEl = document.getElementById(`fc-${index}-name`);
    const iconEl = document.getElementById(`fc-${index}-icon`);
    const tempEl = document.getElementById(`fc-${index}-temp`);
    const maxEl = document.getElementById(`fc-${index}-max`);
    const minEl = document.getElementById(`fc-${index}-min`);

    if (!dayNameEl || !iconEl || !tempEl || !maxEl || !minEl) {
        console.warn(`Missing forecast elements for day ${index}`);
        return;
    }

    // format day name (e.g., Mon, Tue)
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    
    // Update current day and time (only on first render)
    if (index === 0) {
        document.getElementById("day-name").textContent = new Date().toLocaleDateString("en-US", { weekday: "long" });
        document.getElementById("time").textContent = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false 
        });
    }
    
    dayNameEl.textContent = dayName;
    tempEl.textContent = Math.round(item.main.temp);
    maxEl.textContent = Math.round(item.main.temp_max);
    minEl.textContent = Math.round(item.main.temp_min);
    iconEl.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    iconEl.alt = item.weather[0].description;
  });
}