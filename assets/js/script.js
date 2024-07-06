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

const diplayForecast = (data) => {
    data.forEach((forecast) => {
        const dt = forecast.dt;
        const date = new Date(dt* 1000);
        
        const temp = Math.floor(Math.round((forecast.main.temp - 273.15) * 9/5 + 32));
        const wind = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        console.log(date.toLocaleDateString())
        console.log(`Temp: ${temp}`);
        console.log(`Wind Speed: ${wind}MPH`);
        console.log(`Humidity ${humidity}`);
    })
}

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
            data.list[0],
            data.list[7],
            data.list[15],
            data.list[23],
            data.list[31],
            data.list[39]
        ];
        diplayForecast(forecastArray);
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