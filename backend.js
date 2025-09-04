let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Handle search form
document.getElementById("searchForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let query = document.getElementById("searchInput").value.trim();

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
    updateDatalist();
  }
});

// Function to update datalist
function updateDatalist() {
  let dataList = document.getElementById("recentSearches");
  dataList.innerHTML = ""; // Clear old options

  searches.forEach(city => {
    let option = document.createElement("option");
    option.value = city;
    dataList.appendChild(option);
  });
}

// Load on page start
window.onload = updateDatalist;
