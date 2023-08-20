var locationEl = document.querySelector('#location');
var historyEl = document.querySelector('#search-history');
var searchButtonEl = document.querySelector('#searchBtn');
var cityNameEl = document.querySelector('#city-name');
var mainTempEl = document.querySelector('#main-temp');
var mainHumidEl = document.querySelector('#main-humid');
var mainWindEl = document.querySelector('#main-wind');
var fiveDayEl = document.querySelector('#five-day');

// Array stores search history entries
var history = [];

const apiKey = "434a3f34a97a66d8b1e9ce2a24961eaa";

// Adds item to history
function addHistory(city) {
    history.push(city);
    //update local storage
}

// Render history
function renderHistory() {

}

// Calls current weather data
function callWeather(city) {
    // Fetch data
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
            // Get today's date
            currentDay = dayjs().format('MM/DD/YYYY');

            // Get weather type
            var weatherType = data.weather[0].main
            var weatherIcon = ''
            if (weatherType == "Clouds") {
                weatherIcon = '☁️'
            } else if (weatherType === "Clear") {
                weatherIcon ='☀️'
            } else if (weatherType === "Rain") {
                weatherIcon ='🌧️'
            }

            // Populate elements with data
            cityNameEl.textContent = data.name + " " + currentDay + " " + weatherIcon
            mainTempEl.textContent = 'Temperature: ' + data.main.temp + ' °F'
            mainHumidEl.textContent = 'Humidity: ' + data.main.humidity + '%'
            mainWindEl.textContent = 'Wind Speed: ' + data.wind.speed + ' mph'
        })
}

// Calls 5-day forecast data
function callForecast(city) { 
    // Fetch data
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" + apiKey + "&q=" + city;
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
        })
    
}

searchButtonEl.addEventListener('click', function(){
    event.preventDefault();
    // Get user input
    var userInput = locationEl.value.trim();

    // Add to history
    //addHistory(userInput);

    // Update history display
    //renderHistory();

    // Fetch data from API
    callWeather(userInput);
    callForecast(userInput);
});