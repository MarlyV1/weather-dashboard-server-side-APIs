const weatherSection = document.getElementById('weather-section');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.getElementById('form');
const cityBtns = document.querySelector('.city-buttons');
const displayDailyForecast = document.querySelector('.display-forecast');
const displayCurrentWeather = document.querySelector('.card-body');
const date = document.querySelector('.card-header');
const apiKey = `c56024321501e8e5ba43555acb3aab75`;
let city;

//Gets the current weather data of the cities
const currentWeatherData = async (city) => {
    let currentData ;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    try {
        const response = await fetch(url);
        const data = await response.json();
        checkForDuplicateCity(data.name);
        return currentData = data;
    } catch (error) {
        console.error(error.message);
    }
};

//Adds the searched cities to local storage
const searchHistoryInfo = (city) => {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistoryCities')) || [];
    // console.log(searchHistory);
    let userCities = { searchedCity: city };

    searchHistory.push(userCities)
    // console.log(searchHistory);
    localStorage.setItem("searchHistoryCities", JSON.stringify(searchHistory));
};

//Displays the weather forecast for a city when that search history button is clicked
function click(city) {
    // console.log(city)
    getForecast(city);
};

//Displays the cities from local storage to the search history
const displaySearchHistory = () => {
    const displayHistory = JSON.parse(localStorage.getItem('searchHistoryCities'))

    if (displayHistory === null) {
        return;
    } else {
        cityBtns.innerHTML = ''
        displayHistory.forEach((data) => {
            const btn = document.createElement('button');
            btn.onclick = () => click(data.searchedCity);
            btn.textContent = data.searchedCity;
            btn.classList.add('btn-color', 'btn', 'btn-primary');
            cityBtns.append(btn);
        });
    };
};

//A markdown for the weather data 
const dailyForecastMarkdown = (data) => {
    const dt = data.dt;
    const date = (new Date(dt * 1000)).toLocaleDateString();

    const icon = data.weather[0].icon;
    const temp = Math.floor(Math.round((data.main.temp - 273.15) * 9 / 5 + 32));
    const wind = data.wind.speed;
    const humidity = data.main.humidity;

    const markdown = `
        <div class="col-sm">
            <h6>${date}</h6>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
            <h6>Temp: ${temp}°F</h6>
            <h6>Wind: ${wind} MPH</h6>
            <h6>Humidity: ${humidity}%</h6>
        </div>
    `;
    return markdown;
}

//Uses the markdown to display the weather data
const diplayForecast = (current, forecastArray) => {
    let dailyForecast = '';
    const dt = current.dt;
    const currentDate = (new Date(dt * 1000)).toLocaleDateString();
    const icon = current.weather[0].icon;
    const temp = Math.floor(Math.round((current.main.temp - 273.15) * 9 / 5 + 32));

    //Displays the current weather data in the card body
    date.innerText = `${currentDate}`
    displayCurrentWeather.innerHTML = `
        <h3 class="card-title">${current.name}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
        <h6>Temp: ${temp}°F</h6>
        <h6>Wind: ${current.wind.speed} MPH</h6>
        <h6>Humidity: ${current.main.humidity}%</h6>
        `
    //Displays the five day forecast below the card body
    forecastArray.forEach((data) => {
        dailyForecast += dailyForecastMarkdown(data);
    });
    displayDailyForecast.innerHTML = dailyForecast;

    //Changes the style of the weather section so it can be displayed
    weatherSection.style.display = 'block';
    displaySearchHistory();
};

//Gets the 5 day forecast
const getForecast = async (city) => {
    //Uses the coordinates to get the daily forecast
    const currentWeather = await currentWeatherData(city);
    const lat = currentWeather.coord.lat;
    const lon = currentWeather.coord.lon;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        //Fetches the weather data
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        //Puts the daily forecast into an array
        const forecastArray = [
            data.list[7],
            data.list[15],
            data.list[23],
            data.list[31],
            data.list[39]
        ];
        diplayForecast(currentWeather, forecastArray);
    } catch (error) {
        console.error(error.message);
    }
};

//Checks to see if a duplicate city is being added to local storage
const checkForDuplicateCity = (city) => {
    const historyInfo = JSON.parse(localStorage.getItem('searchHistoryCities'))
    if (historyInfo === null) {
        searchHistoryInfo(city);
    } else {
        // console.log(historyInfo)
        const savedCity = historyInfo.find(({ searchedCity }) => searchedCity === city)
        console.log(historyInfo.find(({ searchedCity }) => searchedCity === city))
        if (savedCity === undefined) {
            searchHistoryInfo(city);
        };
    };
};

displaySearchHistory();

//Event listener for the search button
searchBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    city = searchInput.value;
    getForecast(city);
});