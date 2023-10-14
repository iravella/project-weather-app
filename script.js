// Constants
const SUNNY_MESSAGE =
	"Get your sunnies on. Stockholm is looking rather great today.";
const RAINY_MESSAGE =
	"Don’t forget your umbrella. It’s wet in Stockholm today.";
const CLOUDY_MESSAGE =
	"Light a fire and get cosy. Stockholm is looking grey today.";

const forecastURL =
	"https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=693dd010904bcc0402e15bf40afeee28";

// DOM elements
const container = document.getElementById("container");
const currentWeather = document.getElementById("currentWeather");
const weatherImg = document.getElementById("weatherImg");
const weatherText = document.getElementById("weatherText");
const forecastContainer = document.getElementById("forecast-container");

function setImgSrc(src) {
	weatherImg.src = `img/${src}.svg`;
	weatherImg.alt = src;
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
	const weather = weatherClass.split(" ");
	switch (true) {
		case weather.some((str) => str.includes("clear") || str.includes("sun")):
			container.classList.toggle("clear");
			setImgSrc("sunglasses");
			weatherText.innerText = `${SUNNY_MESSAGE}`;
			break;
		case weather.some((str) => str.includes("rain")):
			container.classList.toggle("rain");
			setImgSrc("umbrella");
			weatherText.innerText = `${RAINY_MESSAGE}`;
			break;
		case weather.some((str) => str.includes("cloud")):
			container.classList.toggle("cloudy");
			setImgSrc("cloud");
			weatherText.innerText = `${CLOUDY_MESSAGE}`;
			break;

		default:
			container.classList.toggle("default");
			setImgSrc("cloud");
	}
}

async function getWeather() {
	try {
		const response = await fetch(
			"https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=162e87975bc70dc88548f3920f1c4fdf"
		);
		const weatherResponse = await response.json();
		const weatherClass = weatherResponse.weather[0].description;
		const currentTemperature = Math.round(weatherResponse.main.temp);

		const weatherParagraph = document.createElement("p");
		weatherParagraph.innerHTML += `${weatherClass} | ${currentTemperature}&#176;`;
		currentWeather.appendChild(weatherParagraph);

		setSunTimeParagraph("sunrise", weatherResponse.sys.sunrise);
		setSunTimeParagraph("sunset", weatherResponse.sys.sunset);
		setWeatherClass(weatherClass.toLowerCase());
	} catch (err) {
		console.error(err);
		currentWeather.innerHTML += `Could not get today's weather`;
	}
}

// Feature: Weather forecast
async function getForecast() {
	try {
		const response = await fetch(forecastURL);
		const forecast = await response.json();

		const noonWeather = forecast.list.filter((obj) =>
			obj.dt_txt.includes("12:00:00")
		);

		for (let element of noonWeather) {
			day = new Date(element.dt_txt)
				.toLocaleString("en-US", {
					weekday: "short",
				})
				.toLowerCase();
			forecastContainer.innerHTML += `
		<li class="forecast-li">
			<div class="forecast-li-day">${day} </div>
			<div class="forecast-li-weather">${Math.round(element.main.temp)}&#176; </div>
		</li> 
	`;
		}
	} catch (err) {
		forecastContainer.innerHTML += "Failed to load forecast";
		console.error(err);
	}
}

// search funtion here

// Function calls here
getForecast();
getWeather();
