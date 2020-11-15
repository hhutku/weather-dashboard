# Weather-Dashboard

#### This web application displays both current weather and the 5 day forecast of user-selected cities.

## Functionality

### Selection of Cities
- Users can select a city by either inputting the city's name in the search bar or by clicking on one of the cities listed. Upon clicking search or on a listed city, weather data will be gathered for the selected city.

### Current weather display
- This application displays the city, state, date, and uv index of the location for each inputted city. For the selected city, the current temperature, humidity, wind-speed, a weather icon, and a short weather description is diplayed on the webpage.

### Five-day Forecast
- The 5-day forecast is displayed below the city's current weather. The forecast shows the predicted weather for the following 5 days at 3pm each day. The date of the forecast is displayed along with a weather icon, temperature and humidity.

### Search history- City listings
- The application defaults to list 10 popular cities for the user to select. This list also functions as a search history, updating to include any new cities that the user searches for. The list displays the city name that is called from OpenWeather's api when a city is searched.

### Coding
- This project utilizes javascript and css.
- Bootstraps 4 is utilized for the styling and for media responsiveness.
- jQuery selects and mainpulates the DOM.
- Local storage saves search history data.
- Moment.js capture sthe current date.
- OpenWeather's weather api provides all weather information for each city as well as the dates on the 5-day forecast. https://openweathermap.org/api

![Weather-dashbord Screen-Shot](https://github.com/hhutku/weather-dashboard/blob/main/assets/image1.png)

### Meta

- [Link](https://hhutku.github.io/weather-dashboard/) for the project.






