const apiKey = "9118541886c94a819aa81805250607";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const loader = document.getElementById("loader");

// Create a location display element with icon
let locationDisplay = document.createElement("div");
locationDisplay.id = "locationDisplay";
document.querySelector(".container").insertBefore(locationDisplay, weatherResult);

// Search on button click
searchBtn.addEventListener("click", () => handleSearch());

// Search on Enter key
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

// On page load, show last searched city
window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    }
});

function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        cityInput.classList.add("input-error");
        cityInput.placeholder = "Please type something!";
        cityInput.value = "";
        alert("Please type anything in the search box!");
        setTimeout(() => cityInput.classList.remove("input-error"), 500);
        return;
    }

    const lettersOnly = /^[a-zA-Z\s]+$/;
    if (!lettersOnly.test(city)) {
        cityInput.classList.add("input-error");
        cityInput.value = "";
        cityInput.placeholder = "Numbers not allowed!";
        setTimeout(() => cityInput.classList.remove("input-error"), 500);
        return;
    }

    cityInput.classList.remove("input-error");
    cityInput.style.border = "1px solid #ccc";

    // Save last searched city
    localStorage.setItem("lastCity", city);

    fetchWeather(city);
}

async function fetchWeather(city) {
    weatherResult.innerHTML = "";
    locationDisplay.innerHTML = "";
    loader.style.display = "block";

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=yes&alerts=yes`);

        const data = await response.json();

        if (data.error) {
            cityInput.classList.add("input-error");
            cityInput.value = "";
            cityInput.placeholder = "No city found!";
            loader.style.display = "none";
            setTimeout(() => cityInput.classList.remove("input-error"), 500);
            return;
        }

        loader.style.display = "none";

        // Show location with pin icon
        locationDisplay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
        </svg> ${data.location.name}, ${data.location.country}`;

        displayWeather(data);
    } catch (error) {
        loader.style.display = "none";
        cityInput.classList.add("input-error");
        cityInput.value = "";
        cityInput.placeholder = "No city found!";
        setTimeout(() => cityInput.classList.remove("input-error"), 500);
        console.error(error);
    }
}

function displayWeather(data) {
    weatherResult.innerHTML = "";

    data.forecast.forecastday.forEach((day, index) => {
        const emoji = getWeatherEmoji(day.day.condition.text);

        const dateObj = new Date(day.date);
        const options = { day: "numeric", month: "short" };
        const formattedDate = dateObj.toLocaleDateString(undefined, options);

        const card = document.createElement("div");
        card.classList.add("weather-card");

        // Temp bar percentage (0°C = 0%, 40°C = 100%)
        let tempPercent = Math.min(Math.max((day.day.avgtemp_c / 40) * 100, 0), 100);

        card.innerHTML = `
            <p style="font-size:1rem; font-weight: bold;">${formattedDate}</p>
            <div class="weather-emoji">${emoji}</div>
            <p>${day.day.condition.text}</p>

            <div class="info">
                <span>🌡️ ${day.day.avgtemp_c}°C</span>
                <span>💧 ${day.day.avghumidity}%</span>
                <span>🌬️ ${day.day.maxwind_kph} kph</span>
            </div>

            <div class="temp-bar">
                <div class="temp-bar-fill"></div>
            </div>
        `;

        weatherResult.appendChild(card);

        // Animate temperature bar
        const tempFill = card.querySelector(".temp-bar-fill");
        setTimeout(() => {
            tempFill.style.width = `${tempPercent}%`;
        }, 100);

        // Staggered fade-in
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200);
    });
}

function getWeatherEmoji(condition) {
    condition = condition.toLowerCase();
    if (condition.includes("sunny")) return "☀️";
    if (condition.includes("cloud")) return "☁️";
    if (condition.includes("rain")) return "🌧️";
    if (condition.includes("snow")) return "❄️";
    if (condition.includes("thunder")) return "⛈️";
    if (condition.includes("fog") || condition.includes("mist")) return "🌫️";
    if (condition.includes("clear")) return "🌞";
    return "🌤️";
}

const darkToggle = document.getElementById("dark-toggle");

// Load last theme on page load
window.addEventListener("load", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkToggle.innerHTML = "☀️"; // show sun for dark mode
    }
});

// Toggle dark mode on click
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkToggle.innerHTML = "☀️"; // sun icon in dark mode
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkToggle.innerHTML = "🌙"; // moon icon in light mode
        localStorage.setItem("darkMode", "disabled");
    }
});
