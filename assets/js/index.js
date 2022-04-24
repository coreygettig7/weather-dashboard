var citySearchEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city-input");
var weatherDisplayEl = document.querySelector("#weather-display");
var searchHistoryEl = document.querySelector("#search-history");

var locations = JSON.parse(window.localStorage.getItem("locations")) || [];
var formSubmitHandler = function(event) {
    event.preventDefault();

    const cityName = cityInputEl.value.trim();

    if (cityName) {
        getLocationWeather(cityName);
        locations.push(cityName);
        window.localStorage.setItem("locations", JSON.stringify(locations));
        cityInputEl.value = "";
        var pastSearchesBtns = document.createElement("button");
        pastSearchesBtns.classList = "btn btn-secondary mt-3";
        pastSearchesBtns.setAttribute("type", "submit");
        pastSearchesBtns.innerText = cityName;
        searchHistoryEl.appendChild(pastSearchesBtns);
        pastSearchesBtns.addEventListener("click", function() {
            getLocationWeather(cityName);
        });
    }
    else {
        alert("Please enter a location");
    }
};

var getLocationWeather = function(location) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=5&appid=5fd2e24cefe87724d889816b462af84d";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(locationResponse) {
                    var latitude = locationResponse[0].lat;
                    var longitude = locationResponse[0].lon;

                    var apiUrlLocation = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +"&exclude=minutely,hourly,alerts&units=imperial&appid=5fd2e24cefe87724d889816b462af84d";
                    fetch(apiUrlLocation)
                        .then(function(response) {
                            if (response.ok) {
                                response.json().then(function(data) {
                                    displayWeather(data, location);
                                    displayForecast(data);
                                })
                            }
                            else {
                                alert ("Error! City not found");
                            }
                        })
                        .catch(function(error) {
                            alert("Cannot to connect to Open Weather!");
                        });
                });
            }
            else {
                alert("Error! City not found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Open Weather!");
        });
};

var displayWeather = function(data, location) {
    weatherDisplayEl.textContent = "";

    var todaysWeather = document.createElement("div");
    var todaysWeatherCard = document.createElement("div");
    var cityName = document.createElement("h4");
    var date = moment(data.current.dt *1000).format("M/D/YYYY");
    var currentIcon = data.current.weather[0].icon;
    var currentIconEl = document.createElement("span");
    var currentTemp = document.createElement("p");
    var currentWind = document.createElement("p");
    var currentHumidity = document.createElement("p");

    todaysWeather.setAttribute("class", "card");
    todaysWeatherCard.setAttribute("class", "card-body");
    cityName.setAttribute("class", "card-title");
    cityName.textContent = location + " (" + date +")";
    currentIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentIcon + ".png'>"
    currentTemp.textContent = "Temp: " + data.current.temp + "°F";
    currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
    currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";

    cityName.appendChild(currentIconEl);
    todaysWeatherCard.append(cityName, currentTemp, currentWind, currentHumidity);
    todaysWeather.appendChild(todaysWeatherCard);
    weatherDisplayEl.appendChild(todaysWeather);
};

var displayForecast = function(data) {
    var forecastEl = document.createElement("div");
    var forecastTitle = document.createElement("h5");
    var forecastCardsEl = document.createElement("div");
    forecastTitle.textContent = "Here's the weather for the next 5 days:";
    forecastTitle.setAttribute("class", "mt-3");
    forecastCardsEl.classList = "row d-flex justify-content-around mb-3 mt-3";
    forecastEl.appendChild(forecastTitle);
    weatherDisplayEl.appendChild(forecastEl);
    weatherDisplayEl.appendChild(forecastCardsEl);

    for (var i=1; i < 6; i++) {
        var date = moment(data.daily[i].dt *1000).format("M/D/YYYY");

        var futureDay = document.createElement("div");
        var futureDayBody = document.createElement("div");
        var futureDayDate = document.createElement("h5");
        var futureDayIcon = data.daily[i].weather[0].icon;
        var futureDayIconEl = document.createElement("span");
        var futureDayTemp = document.createElement("p");
        var futureDayWind = document.createElement("p");
        var futureDayHumidity = document.createElement("p");

        futureDay.classList = "card col text-white bg-dark m-3";
        futureDayBody.classList = "card-body";
        futureDayDate.classList = "card-title";
        futureDayDate.textContent = date;
        futureDayIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + futureDayIcon + ".png'>"
        futureDayTemp.classList = "card-text";
        futureDayTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
        futureDayWind.classList = "card-text";
        futureDayWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        futureDayHumidity.classList = "card-text";
        futureDayHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";

        futureDayDate.appendChild(futureDayIconEl);
        futureDayBody.append(futureDayDate, futureDayTemp, futureDayWind, futureDayHumidity);
        futureDay.appendChild(futureDayBody);
        forecastCardsEl.appendChild(futureDay);
    }

};

var loadPastSearches = function() {
    var weatherHistory = JSON.parse(window.localStorage.getItem("locations")) || [];
 
    for (var i=0; i < weatherHistory.length; i++) {
        var locationButton = document.createElement("button");
        locationButton.classList = "btn btn-secondary btn-block mt-2";
        locationButton.innerText = weatherHistory[i];
        const locationText = weatherHistory[i];
        searchHistoryEl.appendChild(locationButton);
        locationButton.addEventListener("click", function() {
            getLocationWeather(locationText);
        });
    }
};

citySearchEl.addEventListener("submit", formSubmitHandler);

loadPastSearches();