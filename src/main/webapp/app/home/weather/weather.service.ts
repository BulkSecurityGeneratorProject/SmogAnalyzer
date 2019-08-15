import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WeatherApiKeyService } from 'app/entities/weather-api-key';
import { filter, map } from 'rxjs/operators';
import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';
import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private static API_ID_STRING_NAME = '&APPID=';
    private _apiKey;
    private _baseUrl;

    private static createRequestUrlFromParameters(...params: string[]): string {
        let url = '';
        for (const param of params) {
            if (url) {
                url = url + ',' + param;
            } else {
                url = url + param;
            }
        }
        console.log(url);
        return url;
    }

    set apiKey(value) {
        this._apiKey = value;
    }

    set baseUrl(value) {
        this._baseUrl = value;
    }

    constructor(
        protected httpClient: HttpClient,
        protected weatherApiKeyService: WeatherApiKeyService,
        protected jhiAlertService: JhiAlertService
    ) {}

    public setRequiredApiData(): Observable<IWeatherApiKey[]> {
        return this.weatherApiKeyService.query().pipe(
            filter((res: HttpResponse<IWeatherApiKey[]>) => res.ok),
            map((res: HttpResponse<IWeatherApiKey[]>) => res.body),
            map((x: IWeatherApiKey[]) => {
                this._apiKey = x[0].apiKey;
                this._baseUrl = x[0].baseUrl;
                return x;
            })
        );
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    public getWeatherByCityNameAndCountryCode(city: string, countryCode: string): Observable<Object> {
        return this.httpClient.get(
            this._baseUrl +
                WeatherService.createRequestUrlFromParameters(city, countryCode) +
                WeatherService.API_ID_STRING_NAME +
                this._apiKey
        );
    }

    public convertTimestampToDateTime(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours + ':' + minutes;
    }
}
