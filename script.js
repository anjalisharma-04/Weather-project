const API_KEY = 'd0901d462170abb8fca8c9bbe2173488'; // Update with API key

// Search weather by city name
async function searchWeather() {
    const cityInput = document.getElementById('cityInput').value.trim();
    if (!cityInput) {
        alert("Please enter a city name.");
        return; 
    }

    try {
        const weatherData = await getWeatherData(cityInput);
        const forecastData = await getForecastData(cityInput);
        
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        alert(error.message || "Error fetching weather data. Please try again.");
        console.error("API Error:", error);
    }
}

// Get current location weather
async function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await getWeatherDataByCoords(latitude, longitude);
                const forecastData = await getForecastDataByCoords(latitude, longitude);
                
                displayCurrentWeather(weatherData);
                displayForecast(forecastData);
            } catch (error) {
                alert("Error fetching weather data. Please try again.");
            }
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Fetch current weather by city
async function getWeatherData(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    console.log("Weather data:", data);
    return data;
}

// Fetch 5-day forecast by city
async function getForecastData(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
    }
    const data = await response.json();
    console.log("Forecast data:", data);
    return data;
}

// Fetch current weather by coordinates
async function getWeatherDataByCoords(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return await response.json();
}

// Fetch 5-day forecast by coordinates
async function getForecastDataByCoords(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return await response.json();
}

// Display current weather
function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed.toFixed(2)} M/S`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weatherIcon').src =`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
   // document.getElementById('weatherDescription').textContent = data.weather[0].description;
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    // Filter one forecast per day at 12:00 PM
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center';
        
        forecastCard.innerHTML = `
            <h4 class="text-xl font-semibold mb-2">${date}</h4>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon" class="w-16 h-16 mb-2">
            <p>Temp: ${forecast.main.temp.toFixed(1)}°C</p>
            <p>Wind: ${forecast.wind.speed.toFixed(2)} M/S</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}