document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".cmp-seven-days__content-days");

  if (!root) return;

  getWeatherNextSevenDays(root);
});

/**
 * Functionality so that the block can remain active
 * @param {*} root the main block
 */
function changeDays(root) {
  const dayBlocks = root.querySelectorAll(".days__day");

  dayBlocks.forEach((day) => {
    day.addEventListener("click", function () {
      dayBlocks.forEach((d) => {
        d.classList.remove("active");

        d.style.backgroundColor = "#ffffff5c";
      });

      day.classList.add("active");

      day.style.backgroundColor = "#ffffff99";
    });
  });
}

/**
 * Fetches and displays the weather forecast for tomorrow and the following days
 * Updates the main tomorrow section and the 7-day forecast cards
 */
async function getWeatherNextSevenDays(root) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=43.3603&longitude=-5.8448&daily=weather_code,wind_speed_10m_max,temperature_2m_mean,rain_sum,relative_humidity_2m_mean&timezone=auto&forecast_days=8";

  try {
    const response = await fetch(url);
    const data = await response.json();

    root.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);

      const name =
        i === 0
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", { weekday: "long" });

      const isoDate = date.toISOString().split("T")[0];
      const indice = data.daily.time.indexOf(isoDate);

      if (indice === -1) {
        continue;
      }

      const block = document.createElement("div");

      block.classList.add("days__day");

      if (i === 0) {
        block.classList.add("active");

        block.style.backgroundColor = "#ffffff99";
      }

      block.dataset.dayIndex = i;

      block.innerHTML = `
        <div class="days__day-title">
          <div class="title__name">${name}</div>
          <div class="title__weather">
            <div class="title__weather-grades">${Math.round(
              data.daily.temperature_2m_mean[indice]
            )}º</div>
            <img
              class="title__weather-img"
              src="${getIconSrc(data.daily.weather_code[indice])}"
              alt="${name}" 
            />
          </div>
        </div>

        <div class="days__day-stats">
          <div class="stats__stat">
            <div class="stats__stat-img">
              <img src="img/umbrella.svg" alt="umbrella" />
            </div>
            <div class="stats__stat-number rainfall">
              ${Math.round(data.daily.rain_sum[indice])} mm
            </div>
          </div>

          <div class="stats__stat">
            <div class="stats__stat-img">
              <img src="img/wind.svg" alt="wind" />
            </div>
            <div class="stats__stat-number wind">
              ${Math.round(data.daily.wind_speed_10m_max[indice])} km/h
            </div>
          </div>

          <div class="stats__stat">
            <div class="stats__stat-img">
              <img src="img/humidity.svg" alt="humidity" />
            </div>
            <div class="stats__stat-number humidity">
              ${data.daily.relative_humidity_2m_mean[indice]}%
            </div>
          </div>
        </div>
      `;

      root.appendChild(block);
    }

    changeDays(root);
  } catch (error) {
    console.error("Error al cargar el clima.", error);
  }
}

/**
 * Returns the image path corresponding to a given weather code
 * @param {*} code - Weather code from the API
 * @returns {string} - Path to the corresponding weather icon
 */
function getIconSrc(weatherCode) {
  let src = "img/cloudy.svg";

  switch (weatherCode) {
    case 0:
      src = "img/sunny.svg";
      break;

    case 1:
    case 2:
      src = "img/icon.svg";
      break;

    case 3:
    case 45:
    case 48:
      src = "img/cloudy.svg";
      break;

    case 51:
    case 53:
    case 55:
      src = "img/cludy.svg";
      break;

    case 61:
    case 63:
    case 65:
    case 80:
    case 95:
      src = "img/rainy.svg";
      break;

    case 71:
    case 73:
    case 75:
    case 85:
    case 86:
      src = "img/snowy.svg";
      break;

    case 96:
    case 99:
      src = "img/storm.svg";
      break;

    default:
      src = "img/cloudy.svg";
      break;
  }

  return src;
}
