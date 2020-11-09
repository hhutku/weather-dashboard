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
var resultWind = $('.resultWind');
var resultUv = $('.resultUv');
var weatherImageTitleEl = $('#weatherImageTitle');

var lasCities = [];

if (!localStorage.getItem("lastCities")) {

    var cities = ["Seattle", "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Diego", "	Boston", "Miami"];

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

    // lastCities.splice(9, 1);
    // lastCities.splice(0, 0, searchCity.val());

    // localStorage.setItem("lastCities", JSON.stringify(lastCities));

    // cityHistory()
    searchCity.val("");

})

$(".city").click(function (e) {
    e.preventDefault();

    apiCall($(this).text());

    // cityHistory();

})



function apiCall(cityName) {

    var weather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + appID;

    // resultCity.text(cityName);
    $.ajax({
        url: weather,
        method: "GET"
    }).then(function (response) {



        if (response.name) {


            lastCities.splice(9, 1);
            lastCities.splice(0, 0, cityName);
             localStorage.setItem("lastCities", JSON.stringify(lastCities));
             cityHistory();
             resultCity.text(cityName);

            console.log("true");


            var currentDate = moment().format(" (M/D/YYYY) ");


            var currentTemp = ((response.main.temp - 273.15) * 9 / 5 + 32).toFixed(1);
            var currentHumidity = response.main.humidity;
            var currentWind = ((response.wind.speed) * 2.237).toFixed(1);
            var currentDesc = response.weather[0].description;
            $('#date').text(currentDate);
            resultTemp.text("Temperature: " + currentTemp + "℉");
            resultHum.text("Humidity: " + currentHumidity + "%");
            resultWind.text("Wind Speed: " + currentWind + " MPH");

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

                resultUv.text("UV Index: " + uviObj.value);

            });

            var fiveDayForcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + appID;

            $.ajax({
                url: fiveDayForcastURL,
                method: "GET"
            }).then(function (fiveDays) {



                //fiveDays.list.length
                //  var fiveDaysDates=fiveDays.list[i].dt_txt.split(" ")[0];



                //     $("#day" + i).children(".card-date").html(fiveDaysDates);
                //     // $("#day" + i).children(".card-icon").html(fiveDays.list[i].weather[0].icon);
                //     $("#weather_image"+i).attr("src", "https://openweathermap.org/img/w/" + fiveDays.list[i].weather[0].icon +".png");
                //     $("#day" + i).children(".card-temp").html("Temp: "+fiveDays.list[i].main.temp.toFixed(1));
                //     $("#day" + i).children(".card-humid").html("Humidity: "+fiveDays.list[i].main.humidity);

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

cityHistory();
