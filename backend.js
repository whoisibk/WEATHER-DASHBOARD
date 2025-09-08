//IMPORTS
import { renderWeather, renderForecast } from "./renderWeather.js";
import { getCoordinates, getForecast, getWeather } from "./weatherApi.js";

//DOM ELEMENTS
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("searchForm");
const favBtn = document.querySelector(".fav-btn");
const locationEl = document.getElementById("location");

//STATE
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
} catch (e) {
  console.warn("Favorites storage corrupted, resetting.");
  favorites = [];
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

let currentCity = null;
try {
  currentCity = JSON.parse(localStorage.getItem("currentCity")) || null;
} catch (e) {
  currentCity = null;
}

//CORE FUNCTIONS
function setCurrentCity(city, country, temp, icon) {
  currentCity = { city, country, temp, icon };
  localStorage.setItem("currentCity", JSON.stringify(currentCity));
  updateFavBtnState();

  // Update the UI label
  locationEl.textContent = `${city}, ${country}`;
}

async function performSearch(city) {
  if (!city) {
    alert("Please enter your city name");
    return;
  }

  try {
    const coords = await getCoordinates(city);
    if (!coords) return;

    const { lat, lon } = coords;
    const weatherData = await getWeather(lat, lon);
    const forecastData = await getForecast(lat, lon);

    // Extract info for current city
    const cityName = weatherData.name;
    const country = weatherData.sys.country;
    const temp = Math.round(weatherData.main.temp);
    const icon = weatherData.weather[0].icon;

    setCurrentCity(cityName, country, temp, icon);

    // Render weather + forecast
    renderWeather(weatherData);
    const daily = forecastData.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );
    renderForecast(daily);
  } catch (err) {
    console.error(err);
    alert("Could not fetch weather data");
  }
}

// Favorites
favBtn.addEventListener("click", () => {
  if (!currentCity) {
    alert("Search a city first!");
    return;
  }

  const existingIndex = favorites.findIndex(
    fav => fav.city.toLowerCase() === currentCity.city.toLowerCase()
  );

  if (existingIndex !== -1) {
    favorites.splice(existingIndex, 1);
    alert(`${currentCity.city} removed from favourites`);
  } else {
    if (favorites.length >= 3) favorites.shift(); // keep max 3
    favorites.push(currentCity);
    alert(`${currentCity.city} added to favourites`);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  updateFavBtnState();
});

function renderFavorites() {
  for (let i = 0; i < 3; i++) {
    const cityEl = document.getElementById(`fav-${i}-city`);
    const countryEl = document.getElementById(`fav-${i}-country`);
    const tempEl = document.getElementById(`fav-${i}-temp`);
    const iconEl = document.getElementById(`fav-${i}-icon`);

    if (favorites[i]) {
      const fav = favorites[i];
      cityEl.textContent = fav.city;
      countryEl.textContent = fav.country;
      tempEl.textContent = fav.temp;
      iconEl.src = `https://openweathermap.org/img/wn/${fav.icon}@2x.png`;
      iconEl.style.display = "block";

      cityEl.parentElement.onclick = () => performSearch(fav.city);
    } else {
      cityEl.textContent = "--";
      countryEl.textContent = "--";
      tempEl.textContent = "--";
      iconEl.style.display = "none";
      cityEl.parentElement.onclick = null;
    }
  }
}

function updateFavBtnState() {
  if (!currentCity) {
    favBtn.textContent = "No city selected";
    favBtn.disabled = true;
    return;
  }

  const isFavorite = favorites.some(
    fav => fav.city.toLowerCase() === currentCity.city.toLowerCase()
  );

  favBtn.textContent = isFavorite
    ? "Remove from favourites"
    : "+ Add to favourite";
  favBtn.disabled = false;
}

//  Event Listeners
// Form submit
searchForm.addEventListener("submit", async e => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    await performSearch(city);
    // ⚡ Keep the input filled so favorites can use it
    searchInput.value = city;
  }
});

// On page load
window.addEventListener("DOMContentLoaded", () => {
  if (currentCity) {
    setCurrentCity(
      currentCity.city,
      currentCity.country,
      currentCity.temp,
      currentCity.icon
    );
    renderFavorites();
  }
});
