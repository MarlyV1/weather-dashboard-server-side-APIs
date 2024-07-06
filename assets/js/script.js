const city = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const atlanta = document.querySelector('.atlanta');
const denver = document.querySelector('.denver');
const seattle = document.querySelector('.seattle');
const sanFrancisco = document.querySelector('.san-francisco');
const orlando = document.querySelector('.orlando');
const newYork = document.querySelector('.new-york');
const chicago = document.querySelector('.chicago');
const austin = document.querySelector('.austin');
const apiKey = `c56024321501e8e5ba43555acb3aab75`

//Get the coordinates of the cities
const getCoordinates = async () => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=1&appid=${apiKey}`

    const response = await fetch(url);
    console.log(data)
    const data = await response.json();
    console.log(data); 
};


//Event listener for the search button
searchBtn.addEventListener("click", (e) => {
    e.preverntDefault;
    getCoordinates();
});