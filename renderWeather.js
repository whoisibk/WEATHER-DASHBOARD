export function renderWeather(data) {
    document.getElementById("wind").textContent = `${data.wind.speed}`;
    document.getElementById("wind-speed").textContent = `${data.wind.speed}`;
    document.getElementById("humidity-value").textContent = `${data.main.humidity}`;
    document.getElementById("visibility-value").textContent = `${data.visibility}`;
    document.getElementById("humidity").textContent = `${data.main.humidity}`;
    document.getElementById("visibility").textContent = `${data.visibility}`;
    document.getElementById("pressure").textContent = `${data.main.pressure}`;
    document.getElementById("sunrise").textContent = `${data.sys.sunrise}`;
    document.getElementById("sunset").textContent = `${data.sys.sunset}`;
    document.getElementById("real-feel").textContent = `${data.main.feels_like}`;
    document.getElementById("pressure-value").textContent = `${data.main.pressure}`;
    document.getElementById("current-condition").textContent = `${data.weather.main}`;
    document.getElementById("current-temp").textContent = `${data.main.temp}`;


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

    // format day name (e.g., Mon, Tue)
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    document.getElementById("day-name").textContent = new Date().toLocaleDateString("en-US", { weekday: "long" });
    document.getElementById("time").textContent = new Date().toLocaleTimeString("en-US", {
             hour: "2-digit",
             minute: "2-digit",
             hour12: false 
                        });
    dayNameEl.textContent = dayName;
    tempEl.textContent = Math.round(item.main.temp);
    maxEl.textContent = Math.round(item.main.temp_max);
    minEl.textContent = Math.round(item.main.temp_min);
    iconEl.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
  });
}