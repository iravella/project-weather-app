let city = "Stockholm"; // default city to start with
const API_KEY = "7309e4a5829fafe809df835ad95f18ea";

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

// Feature: change style depending on weather
function setWeatherClass(weatherClass, city) {
	const weather = weatherClass.split(" ");
	city = city.charAt(0).toUpperCase() + city.slice(1);
	switch (true) {
		case weather.some((str) => str.includes("clear") || str.includes("sun")):
			container.classList.remove(...container.classList);
			container.classList.toggle("clear");
			setImgSrc("sunglasses");
			weatherText.innerText = `Get your sunnies on. ${city} is looking rather great today.`;
			break;
		case weather.some((str) => str.includes("rain")):
			container.classList.remove(...container.classList);
			container.classList.toggle("rain");
			setImgSrc("umbrella");
			weatherText.innerText = `Don't forget your umbrella. It's wet in ${city} today.`;
			break;
		case weather.some((str) => str.includes("cloud")):
			container.classList.remove(...container.classList);
			container.classList.toggle("cloudy");
			setImgSrc("cloud");
			weatherText.innerText = `Light a fire and get cosy. ${city} is looking grey today.`;
			break;

		default:
			container.classList.remove(...container.classList);
			container.classList.toggle("default");
			setImgSrc("cloud");
			weatherText.innerText = city;
	}
}

async function getWeather(city) {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
		);
		const weatherResponse = await response.json();
		const weatherClass = weatherResponse.weather[0].description;
		const currentTemperature = Math.round(weatherResponse.main.temp).toFixed(1);

		const weatherParagraph = document.createElement("p");
		currentWeather.innerHTML = "";
		weatherParagraph.innerHTML = `${weatherClass} | ${currentTemperature}&#176;`;
		currentWeather.appendChild(weatherParagraph);

		setSunTimeParagraph("sunrise", weatherResponse.sys.sunrise);
		setSunTimeParagraph("sunset", weatherResponse.sys.sunset);
		setWeatherClass(weatherClass.toLowerCase(), city);
	} catch (err) {
		console.error(err);
		setImgSrc("");
		weatherText.innerText = "Unvalid City, try again";
		currentWeather.innerHTML = "Unable to load weather";
	}
}

// Feature: Weather forecast
async function getForecast(city) {
	forecastContainer.innerHTML = "";
	const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${API_KEY}`;

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
			<div class="forecast-li-weather">${Math.round(element.main.temp).toFixed(
				1
			)}&#176; </div>
		</li> 
	`;
		}
	} catch (err) {
		forecastContainer.innerHTML += "Failed to load forecast";
		console.error(err);
	}
}

// Function calls here
getForecast(city);
getWeather(city);

// Feature search custom city
function displayCityWeather(e) {
	e.preventDefault();
	const form = new FormData(e.target);
	city = form.get("city").toLowerCase();
	getForecast(city);
	getWeather(city);
}
