import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherItem } from 'app/home/weather/item/weather-item';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    constructor(private httpClient: HttpClient) {}

    // getWeatherItemByCity(cityName: string): Observable<WeatherItem>  {
    //     return this.httpClient.get(
    //
    //     )
    // }
}
