const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherDescription = document.getElementById("weatherDescription");
const weatherImage = document.getElementById("weatherImage");

function setCookie(name, value, seconds) {
    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);

    let expires = "expires=" + d.toUTCString();

    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookieValue(key) {
    let name = key + "=";

    let decodedCookie = decodeURIComponent(document.cookie);

    let ca = decodedCookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let section = ca[i];

        while (section.charAt(0) == " ") {
            section = section.substring(1);
        }

        if (section.indexOf(name) == 0) {
            return section.substring(name.length, section.length);
        }
    }

    return "";
}

function SearchCity() {

    let city = cityInput.value.trim();

    if (city == "") {
        alert("Please enter a city name");
        return;
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onload = function () {

        if (xhr.status == 200) {

            let data = JSON.parse(xhr.responseText);
            if (!data.results || data.results.length == 0) {
                alert("City not found");
                return;
            }
            let latitude = data.results[0].latitude;
            let longitude = data.results[0].longitude;
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,snowfall,weather_code,wind_speed_10m`;

            console.log(weatherUrl);

            const weatherXhr = new XMLHttpRequest();


            weatherXhr.open("GET", weatherUrl, true);

            weatherXhr.onload = function () {
                if (weatherXhr.status === 200) {
                    let result = JSON.parse(weatherXhr.responseText);
                    setCookie("lastCity", city, 86400); //1 gun yadddasda qalacaq
                    cityName.innerText = city;
                    temperature.innerText = result.current.temperature_2m + "°C";
                    feelsLike.innerText = result.current.apparent_temperature + "°C";
                    humidity.innerText = result.current.relative_humidity_2m + "%";
                    windSpeed.innerText = result.current.wind_speed_10m + " km/h";
                    let weatherCode = result.current.weather_code;
                    if (weatherCode == 0) {
                        weatherDescription.innerText = "Sunny";
                        weatherImage.innerText = "☀️";
                    }
                    else if (weatherCode == 1 || weatherCode == 2 || weatherCode == 3) {
                        weatherDescription.innerText = "Cloudy";
                        weatherImage.innerText = "☁️";
                    }
                    else if (weatherCode == 45 || weatherCode == 48) {
                        weatherDescription.innerText = "Foggy";
                        weatherImage.innerText = "🌫️";
                    }
                    else if (weatherCode == 51 || weatherCode == 53 || weatherCode == 55 ||
                        weatherCode == 56 || weatherCode == 57) {
                        weatherDescription.innerText = "Drizzle";
                        weatherImage.innerText = "🌦️";
                    }
                    else if (weatherCode == 61 || weatherCode == 63 || weatherCode == 65 ||
                        weatherCode == 66 || weatherCode == 67 ||
                        weatherCode == 80 || weatherCode == 81 || weatherCode == 82) {
                        weatherDescription.innerText = "Rainy";
                        weatherImage.innerText = "🌧️";
                    }
                    else if (weatherCode == 71 || weatherCode == 73 || weatherCode == 75 ||
                        weatherCode == 77 || weatherCode == 85 || weatherCode == 86) {
                        weatherDescription.innerText = "Snowy";
                        weatherImage.innerText = "❄️";
                    }
                    else if (weatherCode == 95 || weatherCode == 96 || weatherCode == 99) {
                        weatherDescription.innerText = "Thunderstorm";
                        weatherImage.innerText = "⛈️";
                    }
                    else {
                        weatherDescription.innerText = "Unknown";
                        weatherImage.innerText = "🌡️";
                    }
                }
                else {
                    alert("Error found" + " " + weatherXhr.status)
                }



            }

            weatherXhr.send();
        }
        else {
            alert("Error");

        }

    };

    xhr.send();

}

searchBtn.addEventListener("click", SearchCity);
window.onload = function () {

    let lastCity = getCookieValue("lastCity");

    if (lastCity != "") {
        cityInput.value = lastCity;
        SearchCity();
    }

};


// API Sources:
//     1. Open-Meteo Geocoding API:
//        https://open-meteo.com/en/docs/geocoding-api
//     2. Open-Meteo Weather Forecast API:
//        https://open-meteo.com/en/docs