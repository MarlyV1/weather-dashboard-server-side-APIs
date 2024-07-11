const weatherSection = document.getElementById('weather-section');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.getElementById('form');
const cityBtns = document.querySelector('.city-buttons');
const atlanta = document.querySelector('.atlanta');
const denver = document.querySelector('.denver');
const seattle = document.querySelector('.seattle');
const sanFrancisco = document.querySelector('.san-francisco');
const newYork = document.querySelector('.new-york');
const chicago = document.querySelector('.chicago');
const austin = document.querySelector('.austin');
const displayDailyForecast = document.querySelector('.display-forecast');
const displayCurrentWeather = document.querySelector('.card-body');
const date = document.querySelector('.card-header');
const apiKey = `c56024321501e8e5ba43555acb3aab75`;
let city;

//Get the coordinates of the cities
const getCoordinates = async (city) => {
    let coordinates;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

    try {
        const response = await fetch(url);
        const data = await response.json();
        checkForDuplicateCity(data[0].name);
        return coordinates = data[0]
    } catch (error) {
        console.error(error.message);
    }
};

const searchHistoryInfo = (city) => {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistoryCities')) || [];
    console.log(searchHistory);
    let userCities = { searchedCity: city };

    searchHistory.push(userCities)
    console.log(searchHistory);
    localStorage.setItem("searchHistoryCities", JSON.stringify(searchHistory));
};


function click(city) {
    console.log(city)
    getForecast(city);
};


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
    const currentWeather = current.list[0];
    const dt = currentWeather.dt;
    const currentDate = (new Date(dt * 1000)).toLocaleDateString();
    const icon = currentWeather.weather[0].icon;
    const temp = Math.floor(Math.round((currentWeather.main.temp - 273.15) * 9 / 5 + 32));

    //Displays the current weather data in the card body
    date.innerText = `${currentDate}`
    displayCurrentWeather.innerHTML = `
        <h3 class="card-title">${current.city.name}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
        <h6>Temp: ${temp}°F</h6>
        <h6>Wind: ${currentWeather.wind.speed} MPH</h6>
        <h6>Humidity: ${currentWeather.main.humidity}%</h6>
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
    //Uses the coordinates to get the weather forecast
    const coordinateData = await getCoordinates(city);
    const lat = coordinateData.lat;
    const lon = coordinateData.lon;

    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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
        diplayForecast(data, forecastArray);
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
        console.log(historyInfo)
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