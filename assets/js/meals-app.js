/*
https://dummyjson.com/docs
https://www.themealdb.com/api.php
*/
// ============================================
// Simple Meal Recipe App
// ============================================

// API Configuration
const API_URL = "https://www.themealdb.com/api/json/v1/1";
// Global Variables
let details = [];
let allMeals = [];
const MEALS_PER_PAGE = 6;
let currentChunkIndex = 0;

// ============================================
// Function 1: Load All Meals on Page Load
// ============================================
/**
 * Load all meals when page loads
 * Uses Fetch API with Promises
 * Only loads meals starting with letter 'a'
 */
function loadAllMeals() {
  allMeals = [];
  currentChunkIndex = 0;
  fetch(`${API_URL}/search.php?f=a`)
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals || [];
      allMeals = meals;

      //   displayMeals(allMeals);
      displayMealsChunk();
      //   console.log("allMeals:", allMeals);
      document.getElementById("loaderScreen").classList.add("d-none");
    })
    .catch((error) => {
      console.error("Error loading meals:", error);
      alert("Failed to load meals. Please refresh the page.");
      document.getElementById("loaderScreen").classList.add("d-none");
    });
}
// ============================================
// Function 2: Display toast message
// ============================================
function showWarning(message) {
    // 1. إنشاء العنصر
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerText = message;

    // 2. إضافته للصفحة
    document.body.appendChild(toast);

    // 3. حذفه بعد 3 ثوانٍ مع تأثير اختفاء
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}



// ============================================
// Function 2: Display Meals
// ============================================
/**
 * Display meals in the container
 * DOM Manipulation
 * @param {Array} meals - Array of meal objects
 */

function displayMeals(meals, appendData = false) {
  const container = document.getElementById("mealsContainer");

  if (!appendData) {
    container.innerHTML = "";
  }

  if (meals.length === 0 && !appendData) {
    container.innerHTML =
      '<div class="col-12"><p class="text-center">No meals found.</p></div>';
    return;
  }

  meals.forEach((meal) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6 mb-4";

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${meal.strMealThumb}"
                alt="${meal.strMeal}" class="card-img-top" style="height: 250px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text text-muted">${meal.strCategory || "N/A"}</p>
                <button class="btn btn-primary" onclick="showMealDetails('${meal.idMeal}')"data-bs-toggle="modal" data-bs-target="#mealDetailsModal">
                    View Details
                </button>
            </div>
        </div>
    `;

    container.appendChild(col);
  });
}

// ============================================
// Function 3: Display Meals Details
// ============================================
/**
 * Display details meal in the mealDetailsModal
 * DOM Manipulation
 */

function displayDetailsMeal(details) {
  const container = document.querySelector("#mealDetailsModal .modal-body");
  container.innerHTML = "";
  if (details.length === 0) {
    container.innerHTML =
      '<div class="col-12"><p class="text-center">No meal details  found.</p></div>';
    return;
  }

  details.forEach((meal) => {
    const col = document.createElement("div");
    col.className = " m-0";

    col.innerHTML = `
        <div class="shadow-sm">
            <div class="position-relative">
            <img src="${meal.strMealThumb}"
                    alt="${meal.strMeal}" class="card-img-top" style="height: 250px; object-fit: cover;">
                    <a href="${meal.strYoutube}" target="_blank" class="btn btn-primary   position-absolute top-50 start-50 translate-middle">
                    <i class="fab fa-youtube"></i>
                    </a>
            </div>
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text"><strong>Category:</strong> ${meal.strCategory || "N/A"}</p>
                <p class="card-text">
                    <strong>Instructions:</strong>
                    ${meal.strInstructions || "N/A"}</p>
                <p class="card-text">
                    <strong>Area:</strong> ${meal.strArea || "N/A"}
                </p>
            </div>
        </div>
    `;

    container.appendChild(col);

  });
}

// ============================================
// Function 4: Display Meals Chunk (6 meals)
// ============================================

/**
 * Display meals in chunks of 6
 * Simple function for beginners
 */
function displayMealsChunk() {
  const startIndex = currentChunkIndex * MEALS_PER_PAGE; // 0 * 6 => 0
  const endIndex = startIndex + MEALS_PER_PAGE; // 0 + 6 = 6

  const chunk = allMeals.slice(startIndex, endIndex); // 0,6

  if (chunk.length === 0) {
    document.getElementById("loadMoreBtn").classList.add("d-none");
    return;
  }

  displayMeals(chunk, currentChunkIndex > 0);

  if (endIndex >= allMeals.length) {
    document.getElementById("loadMoreBtn").classList.add("d-none");
  } else {
    document.getElementById("loadMoreBtn").classList.remove("d-none");
  }
}

// ============================================
// Function 5: Load More Meals
// ============================================

/**
 * Load more meals from array chunks (6 by 6)
 * Simple function for beginners
 */
function loadMoreMeals() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.disabled = true;

  setTimeout(() => {
    currentChunkIndex++;
    displayMealsChunk();
    loadMoreBtn.disabled = false;
  }, 300);
}

// ============================================
// Function 6: Search Meals
// ============================================

/**
 * Search for meals by name
 * @param {string} searchTerm - The meal name to search for
 */

function searchMeals(searchTerm, areaFilter = "" ) {
    //  console.log("searchTerm",searchTerm, "areaFilter", areaFilter)
     if (!searchTerm && (!areaFilter || areaFilter ==="all")) {
    // If no search term and no area filter, load all meals
            showWarning("No meals found for the given search term and area");
    loadAllMeals();
    return;
    }
if (areaFilter&& areaFilter !=="all") {
    fetch(`${API_URL}/filter.php?a=${encodeURIComponent(areaFilter)}`)
      .then((response) => response.json())
      .then((data) => {
        let meals = data.meals || [];
        console.log("meals by area:", meals);
        allMeals = meals;
        console.log("allMeals by area:", allMeals[0].strMeal.toLowerCase().includes(searchTerm.toLowerCase()));
        // If there's a search term, filter the meals further
        if (searchTerm) {
          const cleanedSearchTerm = sanitizeData(searchTerm).toLowerCase();
          meals = meals.filter((meal) =>
            meal.strMeal.toLowerCase().includes(cleanedSearchTerm)
          );
          if (meals.length === 0) {
            showWarning("No meals found for the given search term and area");
            return;
          }else{
          allMeals = meals;
        }
        } 
        currentChunkIndex = 0;
        displayMealsChunk();
      })
      .catch((error) => {
        console.error("Error loading meals by area:", error);
        alert("Failed to search meals by area. Please try again");
      });
    return;
  }

  // sanitize data
  let cleanedSearchTerm = sanitizeData(searchTerm);
  // reset
  if (!cleanedSearchTerm) {
    currentChunkIndex = 0;
    displayMealsChunk();
    document.getElementById("loadMoreBtn").style.display = "block";
    return;
  }

  fetch(`${API_URL}/search.php?s=${encodeURIComponent(cleanedSearchTerm)}`)
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals || [];

      console.log("meals", meals);
      if (meals.length === 0) {
        showWarning("No meals found for the given search term and area");
        return;
      }
      allMeals = meals;
      console.log("allMeals", allMeals);

      currentChunkIndex = 0;
      displayMealsChunk();
    })
    .catch((error) => {
      console.error("Error loading meals:", error);
      alert("Failed to search meals. Please try again");
    });
}

function sanitizeData(input) {
  return input.trim().replace(/[<>]/g, "");
}

// ============================================
// Function 7: Show Meal Details
// ============================================

/**
 * Show meal details page
 * Navigates to details page
 * @param {string} mealId - The meal ID
 */

function showMealDetails(mealId) {
  fetch(`${API_URL}/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals || [];
      details = meals;
      displayDetailsMeal(details);
      // console.log("meal id is: ", details);
    })
    .catch((error) => {
      console.error("Error loading meal:", error);
      alert("Failed to load meal details. Please try again");
    });
}

// ============================================
// Function 8: Toggle Dark Mode
// ============================================

/**
 * Toggle dark mode and save to localStorage
 * BOM - localStorage usage
 */
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);

  // Update icon
  const icon = document.getElementById("darkModeIcon");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}
/**
 * Load dark mode preference from localStorage
 */
function loadDarkMode() {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeIcon").classList = "fas fa-sun"
  }
}
// ============================================
// Function 9: Load All Regionson Page Load
// ============================================
/**
 * Load All Regions when page loads
 * Uses Fetch API with Promises
 */
function loadAllRegions() {
  fetch(`${API_URL}/list.php?a=list`)
    .then((response) => response.json())
    .then((data) => {
      const allRegions = data.meals || [];
      const regionSelect = document.getElementById("areaFilter");
      allRegions.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.strArea;
        option.textContent = region.strArea;
        regionSelect.appendChild(option);
      });
        // console.log("allRegions:", allRegions);
      document.getElementById("loaderScreen").classList.add("d-none");
    })
    .catch((error) => {
      console.error("Error loading regions:", error);
      alert("Failed to load regions. Please refresh the page.");
      document.getElementById("loaderScreen").classList.add("d-none");
    });
}

// ============================================
window.addEventListener("DOMContentLoaded", function () {
  loadDarkMode();
  loadAllMeals();
  loadAllRegions();

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = document.getElementById("searchInput").value ;
      const regionsFilter = document.getElementById("areaFilter").value;
      searchMeals(searchTerm, regionsFilter);
    });

  document
    .getElementById("darkModeToggle")
    .addEventListener("click", toggleDarkMode);
});


// how to host site in git
// https://www.youtube.com/watch?si=g0LI2C798gyPMMXk&v=e5AwNU3Y2es&feature=youtu.be