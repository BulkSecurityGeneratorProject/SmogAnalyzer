import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'app/home/weather/weather.service';
import { WeatherDataService } from 'app/entities/weather-data';
import { IWeatherData, WeatherData } from 'app/shared/model/weather-data.model';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        this.getWeatherDataCache()
            .toPromise()
            .then(weatherCache => {
                if (weatherCache !== null) {
                    this.weatherData = weatherCache;
                    this.isWeatherDataReceived = true;
                    console.log('weatherDataCache: ' + this.weatherData.city);
                } else {
                    this.weatherService
                        .setRequiredApiData()
                        .toPromise()
                        .then(x => {
                            this.weatherService
                                .getWeatherByCityNameAndCountryCode(this.defaultCity, this.defaultCountryCode)
                                .subscribe(response => {
                                    console.log('response: ' + response);
                                    this.weather = response;
                                    this.weather.weather.icon = this.iconApiLink + this.weather.weather[0].icon + '.png';

                                    this.weatherData = new WeatherData();
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
                                    this.weatherData.name = this.weather.name;
                                    this.weatherData.tempMain = this.weather.main.temp;
                                    this.isWeatherDataReceived = true;

                                    this.weatherDataService.create(this.weatherData).subscribe(weatherDataResponse => {
                                        console.log('Creating weather Data cache object response: ' + weatherDataResponse);
                                    });
                                });
                        });
                }
            });
    }

    private getWeatherDataCache(): Observable<IWeatherData> {
        return this.weatherDataService.query().pipe(
            filter((res: HttpResponse<IWeatherData[]>) => res.ok),
            map((res: HttpResponse<IWeatherData[]>) => res.body),
            map((weatherDataObjects: IWeatherData[]) => {
                const weatherDataCache = weatherDataObjects.filter(weatherData => weatherData.city === this.defaultCity);
                return weatherDataCache.length > 0 ? weatherDataCache[weatherDataCache.length - 1] : null;
            })
        );
    }
}
