import { renderWeather, renderForecast } from "./renderWeather.js"
import { getCoordinates, getForecast, getWeather } from "./weatherApi.js";

let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentCity = localStorage.getItem("currentCity") || null; // Track current searched city
const searchInput = document.getElementById("search-input");

// Handle search form submission (Enter key)
document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  await performSearch();
});

// Handle search icon click
document.querySelector(".search-icon-box").addEventListener("click", async function(event) {
  event.preventDefault();
  await performSearch();
});

// Unified search function
async function performSearch() {
  const city = searchInput.value.trim();

  if (!city) {
    alert("Please enter your city name");
    return;
  }

  // Save to recent searches if not duplicate
  if (city.length >= 2 && !searches.includes(city)) {
    searches.push(city);
    
    // Keep only last 5 searches
    if (searches.length > 5) {
      searches.shift();
    }
    
    // Save to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }

  // Save current city to localStorage
  currentCity = city;
  localStorage.setItem("currentCity", currentCity);

  // Update location display
  document.getElementById("location").textContent = city;

  // Call weather functions
  try {
    await fetchWeather(city);
    const coords = await getCoordinates(city);
    if (coords) {
      const { lat, lon } = coords;
      await fetchForecast(lat, lon);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }

  // Update favorites button state
  updateFavoritesButtonState();
}

// Handle "Add to favorites" button
document.querySelector(".fav-btn").addEventListener("click", function() {
  if (!currentCity) {
    alert("No currently searched city. Please search for a city first.");
    return;
  }

  // Check if city is already in favorites
  const existingFavorite = favorites.find(fav => 
    fav.city.toLowerCase() === currentCity.toLowerCase()
  );

  if (existingFavorite) {
    alert(`${currentCity} is already in your favorites!`);
    return;
  }

  // Add to favorites (we'll get weather data for the favorite)
  addToFavorites(currentCity);
});

// Add city to favorites with weather data
async function addToFavorites(city) {
  try {
    const coords = await getCoordinates(city);
    if (!coords) {
      alert("Could not add city to favorites - location not found");
      return;
    }

    const weatherData = await getWeather(coords.lat, coords.lon);
    if (!weatherData) {
      alert("Could not get weather data for this city");
      return;
    }

    const favoriteData = {
      city: city,
      country: weatherData.sys.country,
      temp: Math.round(weatherData.main.temp),
      icon: weatherData.weather[0].icon,
      lat: coords.lat,
      lon: coords.lon
    };

    favorites.push(favoriteData);
    
    // Keep only last 3 favorites to match the UI
    if (favorites.length > 3) {
      favorites.shift();
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    alert(`${city} added to favorites!`);
    
  } catch (error) {
    console.error("Error adding to favorites:", error);
    alert("Could not add city to favorites");
  }
}

// Render favorites in the UI
function renderFavorites() {
  favorites.forEach((favorite, index) => {
    if (index >= 3) return; // Only show 3 favorites

    const cityEl = document.getElementById(`fav-${index}-city`);
    const countryEl = document.getElementById(`fav-${index}-country`);
    const tempEl = document.getElementById(`fav-${index}-temp`);
    const iconEl = document.getElementById(`fav-${index}-icon`);

    if (cityEl) cityEl.textContent = favorite.city;
    if (countryEl) countryEl.textContent = favorite.country;
    if (tempEl) tempEl.textContent = favorite.temp;
    if (iconEl) {
      iconEl.src = `https://openweathermap.org/img/wn/${favorite.icon}@2x.png`;
      iconEl.style.display = 'block';
    }
  });

  // Clear unused favorite slots
  for (let i = favorites.length; i < 3; i++) {
    const cityEl = document.getElementById(`fav-${i}-city`);
    const countryEl = document.getElementById(`fav-${i}-country`);
    const tempEl = document.getElementById(`fav-${i}-temp`);
    const iconEl = document.getElementById(`fav-${i}-icon`);

    if (cityEl) cityEl.textContent = "--";
    if (countryEl) countryEl.textContent = "--";
    if (tempEl) tempEl.textContent = "--";
    if (iconEl) iconEl.style.display = 'none';
  }
}

// Update favorites button state based on current city
function updateFavoritesButtonState() {
  const favBtn = document.querySelector(".fav-btn");
  
  if (!currentCity) {
    favBtn.style.opacity = "0.5";
    favBtn.style.cursor = "not-allowed";
    favBtn.textContent = "No city selected";
  } else {
    // Check if current city is already in favorites
    const existingFavorite = favorites.find(fav => 
      fav.city.toLowerCase() === currentCity.toLowerCase()
    );
    
    if (existingFavorite) {
      favBtn.style.opacity = "0.7";
      favBtn.textContent = "Already in favorites";
    } else {
      favBtn.style.opacity = "1";
      favBtn.style.cursor = "pointer";
      favBtn.textContent = "+ Add to favourite";
    }
  }
}

// Add click handlers for favorite cards to search those cities
function addFavoriteClickHandlers() {
  for (let i = 0; i < 3; i++) {
    const favCard = document.querySelector(`[data-id="fav-${i}"]`);
    if (favCard) {
      favCard.addEventListener("click", async function() {
        const favorite = favorites[i];
        if (favorite) {
          searchInput.value = favorite.city;
          await performSearch();
        }
      });
    }
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", function() {
  // Load last searched city if exists
  if (currentCity) {
    searchInput.value = currentCity;
    document.getElementById("location").textContent = currentCity;
  }
  
  // Render saved favorites
  renderFavorites();
  
  // Set initial button state
  updateFavoritesButtonState();
  
  // Add favorite click handlers
  addFavoriteClickHandlers();
});

export async function fetchWeather(city) {
    try {
        const coords = await getCoordinates(city);

        if(!coords) {
          console.log("No coordinates for city found");
          return;
        }
    const {lat, lon} = coords;
    const weatherData = await getWeather(lat, lon);

    renderWeather(weatherData);
    }
    catch(error) {
        alert(error.message);
    }
};

export async function fetchForecast(lat, lon) {
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