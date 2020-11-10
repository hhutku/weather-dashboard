var appID = "d0c7a236e73b7d700b29c6edb3005c4a";
var searchCity = $('#searchCity')


if (!JSON.parse(localStorage.getItem("lastCities"))) {
    cityName = "Seattle";
} else {
    searchedCity = JSON.parse(localStorage.getItem("lastCities"))[0];
    var cityName = searchedCity;
}

var searchBtn = $('#searchBtn');
var city1 = $('#city1');
var cities = $('.city');
var resultCity = $('#resultCity');
var resultTemp = $('.resultTemp');
var resultHum = $('.resultHum');
var resultDesc = $('.description');
var resultWind = $('.resultWind');
var resultUv = $('.resultUv');
var weatherImageTitleEl = $('#weatherImageTitle');

var lasCities = [];

if (!localStorage.getItem("lastCities")) {

    var cities = ["SAN FRANCISCO", "NEW YORK CITY", "LOS ANGELES", "CHICAGO", "HOUSTON", "PHOENIX", "PHILADELPHIA", "SAN DIEGO", "BOSTON", " "];

    localStorage.setItem("lastCities", JSON.stringify(cities));

}


lastCities = JSON.parse(localStorage.getItem("lastCities"));



function cityHistory() {

    for (i = 0; i < lastCities.length; i++) {
        $("#city" + i).text(lastCities[i]);
    }
}



apiCall(cityName);

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


             if(!lastCities.includes(cityName.toUpperCase())){
                console.log("hellp");
    console.log(cityName);
 

                lastCities.splice(9, 1);
                lastCities.splice(0, 0, (cityName).toUpperCase());
                localStorage.setItem("lastCities", JSON.stringify(lastCities));
             }
         
            cityHistory();
            resultCity.text(cityName.toUpperCase());

           


            var currentDate = moment().format(" (M/D/YYYY) ");


            var currentTemp = ((response.main.temp - 273.15) * 9 / 5 + 32).toFixed(1);
            var currentHumidity = response.main.humidity;
            var currentWind = ((response.wind.speed) * 2.237).toFixed(1);
            var currentDesc = response.weather[0].description;
            $('#date').text(currentDate);
            resultTemp.text("Temperature: " + currentTemp + "℉");
            resultHum.text("Humidity: " + currentHumidity + "%");
            resultWind.text("Wind Speed: " + currentWind + " MPH");
            resultDesc.text("Description: " + currentDesc);

            weatherImageTitleEl.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");


            var latt = response.coord.lat;
            var longt = response.coord.lon;

            var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";


            var uviAPI = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latt + "&lon=" + longt + "&APPID=" + appID;

            $.ajax({
                url: uviAPI,
                method: "GET"
            }).then(function (uviJSON) {


                var uvi = JSON.stringify(uviJSON);

                var uviObj = JSON.parse(uvi);

                resultUv.text("UV Index: ");

                $('#resultUv').text(uviObj.value)

                var uvValue = parseInt(uviObj.value);

                if (uvValue < 2) {
                    $('#resultUv').css("background-color", "rgb(34, 151, 34)")
                } else if (uvValue < 6) {
                    $('#resultUv').css("background-color", "yellow")
                } else if (uvValue < 8) {
                    $('#resultUv').css("background-color", "orange")
                } else if (uvValue < 11) {
                    $('#resultUv').css("background-color", "red")
                } else {
                    $('#resultUv').css("background-color", "#6538708f")
                }


            });

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



    })


}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

cityHistory();
