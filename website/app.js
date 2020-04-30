/* Global Variables */
let apiKey = ',us&units=imperial&appid=1f266d1da0b22f5b7297aefc1736a750';
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById('generate').addEventListener('click', clickWeather);

// Async function following user clicking on generate button
function clickWeather(e) {
    e.preventDefault();
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value
    if(zipCode.length == 0) {
        alert("Please enter a zip code");
        return;
    }
    if(feelings.length == 0) {
        alert("Please enter a journal entry");
        return;
    }
    console.log(`Retrieving Weather for: ${zipCode}`);
    getWeatherInfo(apiUrl, zipCode, apiKey)
    try{
        .then(function(data){
            console.log(data);
            postData('/post', {
                temperature: data.main.temp,
                sunrise: getTime(data.sys.sunrise),
                sunset: getTime(data.sys.sunset),
                weather: data.weather[0].description,
                date: newDate,
                feelings: feelings
            })
        })
        .then(function(){ 
            updateUI()
        })
    } catch(error) {
        console.log('Oops, Error: ', error);
    }
}

// Returns time of day.
function getTime(unix) {
    let date = new Date(unix * 1000);
    let hours = date.getHours();
    let minutes = '0' + date.getMinutes();
    return `${hours}:${minutes.substr(-2)}`;
}

// Async function to fetch weather data from API
const getWeatherInfo = async (apiUrl, zip, key) => {
    const res = await fetch(apiUrl+zip+key)
    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('Oops, Error: ', error);
    }
}

// Async function to catch Post routes from server
const postData = async ( url = '', data = {})=>{
      const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
     // Body data type must match "Content-Type" header        
      body: JSON.stringify(data), 
    });

      try {
        const newData = await response.json();
        return newData;
      }catch(error) {
      console.log("error", error);
      }
  }

  // Async function that will update the HTML
  let xHold = 0;
  const updateUI = async () => {
    const request = await fetch('/all');
    try{
        const allData = await request.json();
        console.log(allData[xHold].date);
        console.log(allData[xHold].temperature);
        console.log(allData[xHold].feelings);
        document.getElementById('date').innerHTML = `Date: ${allData[xHold].date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData[xHold].temperature}F`;
        document.getElementById('content').innerHTML = `Entry: ${allData[xHold].feelings}`;
        xHold += 1;
    } catch (error) {
        console.log("Update Error", error);
    }
}