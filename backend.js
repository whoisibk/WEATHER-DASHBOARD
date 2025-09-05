import { renderWeather, renderForecast } from "./renderWeather.js"
import { getCoordinates, getForecast, getWeather } from "./weatherApi.js";

let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
const searchInput = document.getElementById("search-input");


// Handle search form
document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  let query = document.getElementById("search-input").value.trim();

  if (query.length >= 2) {
    // Add new search if not duplicate
    if (!searches.includes(query)) {
      searches.push(query);
    }

    // Keep only last 5
    if (searches.length > 5) {
      searches.shift();
    }

    // Save to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(searches));

    // Refresh datalist
    // updateDatalist();

  }
  
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

// Function to update datalist
// function updateDatalist() {
//   let dataList = document.getElementById("recentSearches");
//   dataList.textContent = ""; // Clear old options

//   searches.forEach(city => {
//     let option = document.createElement("option");
//     option.value = city;
//     dataList.appendChild(option);
//   });
// }

// Load on page start
// window.onload = updateDatalist;

export async function fetchWeather(city) {
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
