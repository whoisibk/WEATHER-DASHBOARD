const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = searchInput.value.trim();

    if (!city) {
        alert("Please enter your city name");
        return;
    }


    // Call your existing functions
    fetchWeather(city);
const { lat, lon } = await getCoordinates(city);
fetchForecast(lat, lon);
    
});


const apiKey = "41fad815a12711def87e9d275e436358";

async function getCoordinates(city) {
  if (!city) {
    alert("No city provided");
    return null;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch coordinates");

    const data = await res.json();
    console.log("Geo API response:", data); // ✅ see exactly what you got
    console.log("Length:", data.length)
console.log("City value being sent:", city);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("City not found");
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    alert(error.message);
    return null;
  }
}


async function getWeather(lat, lon) {
    if(!lat || !lon) {
        console.warn("No coordinates provided");
        return;

    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error("failed to fetch weather");
        const data = await res.json();
        return data;
    } 
    catch(error) {
        alert(error.message);
    }
}

async function fetchWeather(city) {
    try {
        const coords = await getCoordinates(city);

        if(!coords) {
          console.log("No coordinates for city found");
          return;
        }
    const {lat, lon} = await getCoordinates(city);
    const weatherData = await getWeather(lat, lon);

    renderWeather(weatherData);
    }
    catch(error) {
        alert(error.message);
    }
};



async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error("failed to fetch forecast");

    const data = await res.json();
    return data;
  }
  catch(error) {
    alert(error.message);
  }
}

async function fetchForecast(lat, lon) {
    try {
        const data = await getForecast(lat, lon);

         if (!data || !data.list) {
            throw new Error("Forecast data unavailable");
        }

        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        renderForecast(daily);
    }
    catch(error) {
        alert(error.message);
    }
}


