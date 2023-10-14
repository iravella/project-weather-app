// Constants
/* const SUNNY_MESSAGE =
  "Get your sunnies on. Stockholm is looking rather great today.";
const RAINY_MESSAGE =
  "Don’t forget your umbrella. It’s wet in ${city} today.";
const CLOUDY_MESSAGE =
  "Light a fire and get cosy. Stockholm is looking grey today."; */

let city = "Stockholm";
//const API_KEY = "736699be9817dd8fcbc05fed82aa17ed";

const API_KEY = "7309e4a5829fafe809df835ad95f18ea";

const container = document.getElementById("container");
const currentWeather = document.getElementById("currentWeather");
const weatherImg = document.getElementById("weatherImg");
const weatherText = document.getElementById("weatherText");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

function setCity(cityName) {
	city = cityName;
	searchInput.value = cityName;
  }
  

function setImgSrc(src) {
  console.log("hej hej");
  weatherImg.src = `img/${src}.svg`;
}
// Feature: Sunrise and sunset
function setSunTimeParagraph(sunTime, milliSeconds) {
  const timeInHours = new Date(milliSeconds * 1000)
    .toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
    .replace(":", ".");
  const sunTimeParagraph = document.createElement("p");
  sunTimeParagraph.innerHTML += `${sunTime} ${timeInHours}`;
  currentWeather.appendChild(sunTimeParagraph);
}

function setWeatherClass(weatherClass) {
  switch (weatherClass) {
    case "clear":
      container.classList.toggle("clear");
      setImgSrc("sunglasses");
      weatherText.innerText = `Get your sunnies on. ${city} is looking rather great today.`;
      break;
    case "rain":
    case "drizzle":
      container.classList.toggle("rain");
      setImgSrc("umbrella");
      weatherText.innerText = `Don't forget your umbrella. It's wet in ${city} today.`;
      break;
    case "cloudy":
    case "clouds":
      container.classList.toggle("cloudy");
      setImgSrc("cloud");
      weatherText.innerText = `Light a fire and get cosy. ${city} is looking grey today.`;
      break;
    default:
      container.classList.toggle("default");
  }
}

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
    );
    const weatherResponse = await response.json();
    //if (weatherResponse.weather && weatherResponse.weather.length > 0) {
      const weatherClass = weatherResponse.weather[0].main;
      const currentTemperature = Math.round(weatherResponse.main.temp);

	  currentWeather.innerHTML = ""; // Clear existing content
      const weatherParagraph = document.createElement("p");
      weatherParagraph.innerHTML += `${weatherClass} | ${currentTemperature}&#176;`;
      currentWeather.appendChild(weatherParagraph);

      setSunTimeParagraph("sunrise", weatherResponse.sys.sunrise);
      setSunTimeParagraph("sunset", weatherResponse.sys.sunset);
      setWeatherClass(weatherClass.toLowerCase());
	  //city = weatherResponse.name;

	  setCity(weatherResponse.name); // Update the city variable with the actual city name

    //} else {
    //   currentWeather.innerHTML = "No weather data available.";
    // }
  } catch (err) {
    console.error(err);
    currentWeather.innerHTML += `Could not get today's weather for ${city}`;
  }
}

const forecastContainer = document.getElementById("forecast-container");
//const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${API_KEY}`;

async function getForecast(city) {
	const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${API_KEY}`;

  try {
    const response = await fetch(forecastURL);
    const forecast = await response.json();

	forecastContainer.innerHTML = ""; // Clear existing content

    const noonWeather = forecast.list.filter((obj) =>
      obj.dt_txt.includes("12:00:00")
    );

    for (let element of noonWeather) {
      forecastContainer.innerHTML += `
		<li class="forecast-li">
			<div class="forecast-li-day">${element.dt_txt.substring(0, 10)} </div>
			<div class="forecast-li-weather">${
        element.weather[0].description
      } | ${Math.round(element.main.temp)}&#176; </div>
		</li> 
	`;
    }
  } catch (err) {
    console.error(err);
  }
}

searchButton.addEventListener("click", () => {
  const newCity = searchInput.value.trim();
  if (newCity) {
	//setCity(newCity);
	//city = newCity; 
	//searchInput.value = city;
	getWeather(newcity);
	getForecast(newcity);
  } else {
	console.log("Please enter a city name.");
  }
});

// Function calls here
getWeather(city);
getForecast(city);
