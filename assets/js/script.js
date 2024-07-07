const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const atlanta = document.querySelector('.atlanta');
const denver = document.querySelector('.denver');
const seattle = document.querySelector('.seattle');
const sanFrancisco = document.querySelector('.san-francisco');
const orlando = document.querySelector('.orlando');
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
        return coordinates = data[0] 
    } catch (error) {
        console.error(error.message);
    }
};

const dailyForecastMarkdown = (data) => {
    const dt = data.dt;
    const date = (new Date(dt* 1000)).toLocaleDateString();
    
    const temp = Math.floor(Math.round((data.main.temp - 273.15) * 9/5 + 32));
    const wind = data.wind.speed;
    const humidity = data.main.humidity;

    const markdown = `
        <div class="col-sm">
            <h6>${date}</h6>
            <h6>Temp: ${temp}°F</h6>
            <h6>Wind: ${wind}MPH</h6>
            <h6>Humidity: ${humidity}%</h6>
        </div>
    `;
    return markdown;
}


const diplayForecast = (current, forecastArray) => {
    let dailyForecast = '';
    const currentWeather = current.list[0];
    const dt = currentWeather.dt;
    const currentDate = (new Date(dt* 1000)).toLocaleDateString();
    
    const temp = Math.floor(Math.round((currentWeather.main.temp - 273.15) * 9/5 + 32));

    date.innerText = `${currentDate}`
    displayCurrentWeather.innerHTML = `
        <h3 class="card-title">${current.city.name}</h3>
        <h6>Temp: ${temp}°F</h6>
        <h6>Wind: ${currentWeather.wind.speed}MPH</h6>
        <h6>Humidity: ${currentWeather.main.humidity}%</h6>
        `

    forecastArray.forEach((data) => {
        dailyForecast += dailyForecastMarkdown(data);
    });
    displayDailyForecast.innerHTML = dailyForecast;
};

//Gets the 5 day forecast
const getForecast = async (city) => {
    const coordinateData = await getCoordinates(city);
    const lat = coordinateData.lat;
    const lon = coordinateData.lon;

    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        const forecastArray = [
            data.list[7],
            data.list[15],
            data.list[23],
            data.list[31],
            data.list[39]
        ];
        diplayForecast(data,forecastArray);
    } catch (error) {
        console.error(error.message);
    }
    
};

//Event listener for the search button
searchBtn.addEventListener("click", (e) => {
    e.preverntDefault;
    city = searchInput.value
    getForecast(city);
});

//Event listener to get the weather for Atlanta
atlanta.addEventListener("click", (e) => {
    e.preventDefault;
    city = 'atlanta';
    getForecast(city);
})