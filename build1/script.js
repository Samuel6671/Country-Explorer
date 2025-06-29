const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population";

let countries = [];
let filteredCountries = [];
let currentPage = 1;
const itemsPerPage = 20;

// DOM Elements
const container = document.getElementById("countryContainer");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");
const sortSelect = document.getElementById("sort");
const pagination = document.getElementById("pagination");

async function fetchCountries() {
  const res = await fetch(API_URL);
  countries = await res.json();
  filteredCountries = [...countries];
  render();
}

function render() {
  let data = [...filteredCountries];

  // Sort
  const sortOrder = sortSelect.value;
  if (sortOrder === "asc") {
    data.sort((a, b) => a.population - b.population);
  } else if (sortOrder === "desc") {
    data.sort((a, b) => b.population - a.population);
  }

  // Pagination
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  container.innerHTML = paginatedData.map(country => `
    <div class="card">
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
      <h3>${country.name.common}</h3>
      <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    </div>
  `).join("");

  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.onclick = () => {
      currentPage = i;
      render();
    };
    pagination.appendChild(btn);
  }
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const region = regionFilter.value;

  filteredCountries = countries.filter(country => {
    const matchesName = country.name.common.toLowerCase().includes(search);
    const matchesRegion = !region || country.region === region;
    return matchesName && matchesRegion;
  });

  currentPage = 1;
  render();
}

// Event Listeners
searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", render);

// Initialize
fetchCountries();
