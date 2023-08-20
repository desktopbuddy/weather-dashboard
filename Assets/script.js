var locationEl = document.querySelector('#location');
var historyEl = document.querySelector('#search-history');
var searchButtonEl = document.querySelector('#searchBtn');
var cityNameEl = document.querySelector('#city-name');
var mainTempEl = document.querySelector('#main-temp');
var mainHumidEl = document.querySelector('#main-humid');
var mainWindEl = document.querySelector('#main-wind');
var fiveDayEl = document.querySelector('#five-day');


const apiKey = "434a3f34a97a66d8b1e9ce2a24961eaa";

// Adds item to history
function addHistory(city) {
    if(city) {
        // Get local storage data
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        //update local storage
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update history display on page
        renderHistory();
    }
}

// Render history on page
function renderHistory() {
    // Clear element
    historyEl.innerHTML = '';
    // Get local storage data
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    for (var i = 0; i < searchHistory.length; i++) {
        var searchEntry = searchHistory[i];
        var listItem = document.createElement('li');
        var listBtn = document.createElement('button');
        listBtn.setAttribute('data-search', searchEntry);
        listBtn.setAttribute('class', 'btn btn-light history-btn');
        listBtn.textContent = searchEntry;
        
        listItem.appendChild(listBtn);
        historyEl.appendChild(listItem);
    }
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
    fiveDayEl.innerHTML=''
    // Fetch data
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" + apiKey + "&q=" + city;
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // increment by 8 to skip 24 hours to next day
            for(var i = 6; i < data.list.length; i+=8) {
                // Get date
                var forecastDate = dayjs(data.list[i].dt * 1000).format('MM/DD/YYYY')
                console.log(forecastDate);

                // Get weather type
                var weatherType = data.list[i].weather[0].main
                var weatherIcon = ''
                if (weatherType == "Clouds") {
                    weatherIcon = '☁️'
                } else if (weatherType === "Clear") {
                    weatherIcon ='☀️'
                } else if (weatherType === "Rain") {
                    weatherIcon ='🌧️'
                }

                var temp = data.list[i].main.temp
                var humid = data.list[i].main.humidity
                var wind = data.list[i].wind.speed

                var weatherCard = 
                `<div class="card m-2 col-lg-2 col-md-2 bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">${forecastDate}</h5>
                        <p>${weatherIcon}</p>
                        <p class="card-text">Temperature: ${temp} °F</p>
                        <p class="card-text">Humidity: ${humid}%</p>
                        <p class="card-text">Wind Speed: ${wind} Mph</p>
                    </div>
                </div>`

                fiveDayEl.innerHTML += weatherCard
            }
        })
    
}

// Render history at load of page
renderHistory();

searchButtonEl.addEventListener('click', function(){
    event.preventDefault();
    // Get user input
    var userInput = locationEl.value.trim();

    // Add to history
    addHistory(userInput);

    // Fetch data from API
    callWeather(userInput);
    callForecast(userInput);
});

historyEl.addEventListener('click', function(event) {
    if(event.target.nodeName == "BUTTON") {
        console.log(event.target.dataset.search)
        callWeather(event.target.dataset.search);
        callForecast(event.target.dataset.search);
    }
})