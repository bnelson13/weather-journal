/* Global Variables */
let apiKey = ',us&units=imperial&appid=1f266d1da0b22f5b7297aefc1736a750';
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById('generate').addEventListener('click', clickWeather);

function clickWeather(e) {
    let zipCode = document.getElementById('zipCode').value;
    let feelings = document.getElementById('feelings').value
    console.log(`Retrieving Weather for: ${zipCode}`);
    getWeatherInfo(apiUrl, zipCode, apiKey)
    .then(function(data){
        postData('/post', {
            temperature: data.main.temp,
            sunrise: getTime(data.sys.sunrise),
            sunset: getTime(data.sys.sunset),
            weather: data.weather[0].description,
            date: newDate,
            feelings: feelings
            })
    })
    .then(
        function(){ 
            updateUI()
    })
}

function getTime(unix) {
    let date = new Date(unix * 1000);
    let hours = date.getHours();
    let minutes = '0' + date.getMinutes();
    return `${hours}:${minutes.substr(-2)}`;
}

const getWeatherInfo = async (apiUrl, zip, key) => {
    const res = await fetch(apiUrl+zip+key)
    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('Oops, Error: ', error);
    }
}

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

  const updateUI = async () => {
    const request = await fetch('/all');
    try{
        const allData = await request.json();
        console.log(allData[0].date);
        console.log(allData[0].temperature);
        console.log(allData[0].feelings);
        document.getElementById('date').innerHTML = `Today's date is ${allData[0].date}`;
        document.getElementById('temp').innerHTML = `Current Temperature is ${allData[0].temperature}`;
        document.getElementById('content').innerHTML = allData[0].feelings;
    } catch (error) {
        console.log("Update Error", error);
    }
}