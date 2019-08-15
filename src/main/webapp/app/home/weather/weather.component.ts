import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'app/home/weather/weather.service';
import { WeatherDataService } from 'app/entities/weather-data';
import { IWeatherData, WeatherData } from 'app/shared/model/weather-data.model';

@Component({
    selector: 'jhi-weather',
    templateUrl: './weather.component.html',
    styles: []
})
export class WeatherComponent implements OnInit {
    defaultCity = 'Kraków';
    defaultCountryCode = 'PL';
    iconApiLink = 'https://openweathermap.org/img/w/';
    weather: any;
    isWeatherDataReceived: boolean;
    weatherData: IWeatherData;
    // celsiusDegreesSymbol = '  &#778;C';

    constructor(public weatherService: WeatherService, public weatherDataService: WeatherDataService) {}

    ngOnInit() {
        this.weatherService
            .setRequiredApiData()
            .toPromise()
            .then(x => {
                console.log(x);
                this.weatherService.getWeatherByCityNameAndCountryCode(this.defaultCity, this.defaultCountryCode).subscribe(response => {
                    console.log(response);
                    this.weather = response;
                    this.weather.weather.icon = this.iconApiLink + this.weather.weather[0].icon + '.png';
                    this.isWeatherDataReceived = true;
                });
            });
        this.weatherData = new WeatherData();
        if (this.isWeatherDataReceived) {
            this.weatherData.city = this.defaultCity;
            this.weatherData.icon = this.weather.weather.icon;
            this.weatherData.tempMin = this.weather.main.temp_min;
            this.weatherData.tempMax = this.weather.main.temp_max;
            this.weatherData.sunrise = this.weather.sys.sunrise;
            this.weatherData.sunset = this.weather.sys.sunset;
            this.weatherData.humidity = this.weather.main.humidity;
            this.weatherData.cloudiness = this.weather.clouds.all;
            this.weatherData.pressure = this.weather.main.pressure;
            this.weatherData.windSpeed = this.weather.wind.speed;
        }
        // this.weatherDataService.create();
    }
}
