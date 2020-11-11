var appID = "d0c7a236e73b7d700b29c6edb3005c4a";
var searchCity = $('#searchCity')
var searchBtn = $('#searchBtn');
var cities = $('.city');
var resultCityEl = $('#resultCity');
var resultTempEl = $('.resultTemp');
var resultHumEl = $('.resultHum');
var resultDescEl = $('.description');
var resultWindEl = $('.resultWind');
var resultUvEl = $('.resultUv');
var uvColor = $('#resultUv');
var weatherImageTitleEl = $('#weatherImageTitle');
var fahreneitEl = $('#fahreneit');
var celciusEl = $('#celcius');
var lasCities = [];


if (!localStorage.getItem("lastCities")) {
    var cities = ["SEATTLE", "SAN FRANCISCO", "NEW YORK CITY", "LOS ANGELES", "CHICAGO", "HOUSTON", "PHOENIX", "PHILADELPHIA", "SAN DIEGO", "BOSTON"];
    localStorage.setItem("lastCities", JSON.stringify(cities));
}
var cityName = JSON.parse(localStorage.getItem("lastCities"))[0];

lastCities = JSON.parse(localStorage.getItem("lastCities"));

function cityHistoryDisplay() {
    for (i = 0; i < lastCities.length; i++) {
        $("#city" + i).text(lastCities[i]);
    }
}

$("#searchBtn").click(function (e) {
    e.preventDefault();
    apiCall(searchCity.val());
    searchCity.val("");
})

$(".city").click(function (e) {
    e.preventDefault();
    apiCall($(this).text());

})
function apiCall(cityName) {

    var weather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + appID;

    $.ajax({
        url: weather,
        method: "GET"
    }).then(function (response) {

        if (response.name) {

            if (!lastCities.includes(cityName.toUpperCase())) {
                lastCities.splice(9, 1);
                lastCities.splice(0, 0, (cityName).toUpperCase());
                localStorage.setItem("lastCities", JSON.stringify(lastCities));
            }

            displayCurrentCity(cityName, response);
            displayUV(response.coord.lat, response.coord.lon, appID);
            displayFiveDays(cityName, appID);
            cityHistoryDisplay();

        }

    })
}

function displayCurrentCity(cityName, response) {

    resultCityEl.text(cityName.toUpperCase());
    var currentDate = moment().format(" (M/D/YYYY) ");

    var currentFah = ((response.main.temp - 273.15) * 9 / 5 + 32).toFixed(1);
    var currentCel = (response.main.temp - 273.15).toFixed(1);

    var currentHumidity = response.main.humidity;
    var currentWind = ((response.wind.speed) * 2.237).toFixed(1);
    var currentDesc = response.weather[0].description;
    $('#date').text(currentDate);
    resultTempEl.text("Temperature:  ");

    fahOrCelcius(currentFah,currentCel);

    fahreneitEl.text(" ℉");
    $('#slash').text(" / ");
    celciusEl.text("°C");
    resultHumEl.text("Humidity: " + currentHumidity + "%");
    resultWindEl.text("Wind Speed: " + currentWind + " MPH");
    resultDescEl.text("Description: " + capFirstLetter(currentDesc));
    weatherImageTitleEl.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

}

function displayFiveDays(cityName, appID) {
    var fiveDayForcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + appID;

    $.ajax({
        url: fiveDayForcastURL,
        method: "GET"
    }).then(function (fiveDays) {

        var count = 1;
        for (var i = 0; i < fiveDays.list.length; i++) {
            var fiveDaysDates = fiveDays.list[i].dt_txt.split(" ")[0];
            var time = fiveDays.list[i].dt_txt.split(" ")[1];

            if (time === "15:00:00") {

                $("#day" + count).children(".card-date").html(fiveDaysDates);
                $("#weather_image" + count).attr("src", "https://openweathermap.org/img/w/" + fiveDays.list[i].weather[0].icon + ".png");
                $("#day" + count).children(".card-temp").html("Temp: " + fiveDays.list[i].main.temp.toFixed(1) + " °F");
                $("#day" + count).children(".card-humid").html("Humidity: " + fiveDays.list[i].main.humidity + " %");
                count++;
            }
        }
    });
}

function displayUV(latt, longt, appID) {

    var uviAPI = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latt + "&lon=" + longt + "&APPID=" + appID;

    $.ajax({
        url: uviAPI,
        method: "GET"
    }).then(function (uviJSON) {
        var uvi = JSON.stringify(uviJSON);
        var uviObj = JSON.parse(uvi);
        resultUvEl.text("UV Index: ");
        uvColor.text(uviObj.value)
        var uvValue = parseInt(uviObj.value);
        if (uvValue < 2) {
            uvColor.css("background-color", "rgb(34, 151, 34)")
        } else if (uvValue < 6) {
            uvColor.css("background-color", "yellow")
        } else if (uvValue < 8) {
            uvColor.css("background-color", "orange")
        } else if (uvValue < 11) {
            uvColor.css("background-color", "red")
        } else {
            uvColor.css("background-color", "#6538708f")
        }
    });
}
function fahOrCelcius(currentFah,currentCel){

    if ($('#fahreneit').hasClass("flag")) {
        $('.resultTemp1').text(currentFah);
    } else {
        $('.resultTemp1').text(currentCel)
    }
    fahreneitEl.click(function () {
     
            fahreneitEl.addClass("bold");
            celciusEl.removeClass("bold");
            $('.resultTemp1').text(currentFah) 
            $('#fahreneit').addClass("flag")         
        
    })
    celciusEl.click(function () {
       
            $(fahreneitEl).removeClass("bold")
            $(celciusEl).addClass("bold");

            $('#fahreneit').removeClass("flag")  
            
            $('.resultTemp1').text(currentCel)
      
    })

}


cityHistoryDisplay();
apiCall(cityName);



function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
