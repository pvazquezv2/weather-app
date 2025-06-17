const carousel = document.getElementById("carousel");
let isDragging = false;
let startX;
let scrollLeft;

/**
 * Mouse scroll for desktop
 */
carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseleave", () => {
  isDragging = false;
  carousel.classList.remove("dragging");
});

carousel.addEventListener("mouseup", () => {
  isDragging = false;
  carousel.classList.remove("dragging");
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = x - startX;
  carousel.scrollLeft = scrollLeft - walk;
});

/**
 * Touch scroll for mobile
 */
carousel.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("touchend", () => {
  isDragging = false;
});

carousel.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = x - startX;
  carousel.scrollLeft = scrollLeft - walk;
});

/**
 * Returns the city name from geographic coordinates using Geoapify Reverse Geocoding API
 * @param {*} lat - the latitude of the location
 * @param {*} lon  - the longitude of  the location
 * @returns - The name of the city
 */
async function getCityNameFromCoords(lat, lon) {
  const apiKey = "ce65829d5a4f454187b29a45f81b329a";
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features.length == 0) {
      return "Ubicación desconocida";
    }

    const props = data.features[0].properties;
    const city = props.city;

    return city;
  } catch (error) {
    return "Error";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const city = await getCityNameFromCoords(43.3619, -5.8494);
  const titleEl = document.querySelector(".title__name");
  if (titleEl) titleEl.textContent = `${city}, España`;
});

/**
 * Fetches and displays current weather data (temperature, weather code, rain, wind, humidity)
 * Uses Open-Meteo API
 * Updates the DOM elements with the fetched data
 */
async function getWeatherData() {
  const current =
    "https://api.open-meteo.com/v1/forecast?latitude=43.3603&longitude=-5.8448&current=temperature_2m,rain,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto";

  try {
    const response = await fetch(current);
    const data = await response.json();

    const lat = data.current.latitude;
    const lon = data.current.longitude;

    const currentTemp = Math.round(data.current.temperature_2m);
    document.querySelector(".number__cuantity").textContent = currentTemp;

    const weatherCode = data.current.weather_code;
    document.querySelector(".number__text").textContent =
      getWeatherDescription(weatherCode);
    const img = document.querySelector(".weather__img");

    switch (weatherCode) {
      case 0:
        img.src = "img/sunny.svg";
        break;
      case 1:
      case 2:
        img.src = "img/icon.svg";
        break;

      case 3:
      case 45:
      case 48:
        img.src = "img/cloudy.svg";
        break;

      case 51:
      case 53:
      case 55:
        img.src = "img/cludy.svg";
        break;

      case 61:
      case 63:
      case 65:
      case 80:
      case 95:
        img.src = "img/rainy.svg";
        break;
    }

    const currentRain = data.current.rain + " mm";
    const currentWind = data.current.wind_speed_10m + " km/h";
    const currentHumidity = data.current.relative_humidity_2m + "%";
    document.querySelector(
      ".stats__stat .cuantity__number.rainfall"
    ).textContent = currentRain;
    document.querySelector(".stats__stat .cuantity__number.wind").textContent =
      currentWind;
    document.querySelector(
      ".stats__stat .cuantity__number.humidity"
    ).textContent = currentHumidity;
  } catch (error) {
    return "error";
  }
}

/**
 * Returns a weather description string based on the given weather code
 * @param {*} code - Weather code from the API
 * @returns {string} - Weather description
 */
function getWeatherDescription(code) {
  const map = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    80: "Rain Showers",
    95: "Thunderstorm",
  };
  return map[code];
}

getWeatherData();

/**
 * Fetches and renders hourly weather data into a carrousel
 * Displays weather for today or tomorrow depending on the dayIndex
 * @param {*} dayIndex - 0 for today, 1 for tomorrow
 */
async function carruselWeather(dayIndex = 0) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=43.3603&longitude=-5.8448&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=2";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const hours = data.hourly.time;
    const temps = data.hourly.temperature_2m;
    const weatherCodes = data.hourly.weather_code;

    const carousel = document.getElementById("carousel");

    carousel.innerHTML = "";

    const now = new Date();
    const nowHour = now.getHours();
    const currentDay = now.getDate();

    hours.forEach((time, index) => {
      const date = new Date(time);
      const itemDay = date.getDate();

      if (itemDay !== currentDay + dayIndex) return;

      const hourStr = date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const temp = Math.round(temps[index]);

      const isNow = dayIndex === 0 && date.getHours() === nowHour;

      const boxClass = isNow ? "carrousel__active" : "carrousel__box";

      const hourLabel = isNow ? "now" : hourStr;

      const weatherCode = weatherCodes[index];
      let img = "img/cloudy.svg";

      switch (weatherCode) {
        case 0:
          img = "img/sunny.svg";
          break;
        case 1:
        case 2:
          img = "img/icon.svg";
          break;
        case 3:
        case 45:
        case 48:
          img = "img/cloudy.svg";
          break;
        case 51:
        case 53:
        case 55:
          img = "img/cludy.svg";
          break;
        case 61:
        case 63:
        case 65:
        case 80:
        case 95:
          img = "img/rainy.svg";
          break;
      }

      const box = document.createElement("div");

      box.classList.add(boxClass);
      box.innerHTML = `
        <div class="${boxClass}-hour">${hourLabel}</div>
        <img class="${boxClass}-img" src="${img}" alt="${hourLabel}" />
        <div class="${boxClass}-temp">${temp}°</div>
      `;

      carousel.appendChild(box);
    });
  } catch (error) {
    console.error("Error al cargar el clima para el carrusel.", error);
  }
}

document
  .querySelector(".now-tomorrow__days-today")
  .addEventListener("click", function () {
    carruselWeather(0);
    this.style.fontWeight = "700";

    const tomorrow = document.querySelector(".now-tomorrow__days-tomorrow");

    tomorrow.style.fontWeight = "400";

    document.querySelector(".days__separate-focus").classList.remove("active");
  });

document
  .querySelector(".now-tomorrow__days-tomorrow")
  .addEventListener("click", function () {
    carruselWeather(1);
    this.style.fontWeight = "700";

    const today = document.querySelector(".now-tomorrow__days-today");

    today.style.fontWeight = "400";

    document.querySelector(".days__separate-focus").classList.add("active");
  });

carruselWeather(0);
