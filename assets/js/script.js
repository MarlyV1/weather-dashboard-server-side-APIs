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
        const dt = data.list[0].dt;
        const date = new Date(dt* 1000);
        console.log(date.toLocaleDateString())
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