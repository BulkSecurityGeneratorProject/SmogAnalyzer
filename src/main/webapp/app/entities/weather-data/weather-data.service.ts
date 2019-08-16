import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWeatherData } from 'app/shared/model/weather-data.model';

type EntityResponseType = HttpResponse<IWeatherData>;
type EntityArrayResponseType = HttpResponse<IWeatherData[]>;

@Injectable({ providedIn: 'root' })
export class WeatherDataService {
    public resourceUrl = SERVER_API_URL + 'api/weather-data';

    constructor(protected http: HttpClient) {}

    create(weatherData: IWeatherData): Observable<EntityResponseType> {
        return this.http.post<IWeatherData>(this.resourceUrl, weatherData, { observe: 'response' });
    }

    update(weatherData: IWeatherData): Observable<EntityResponseType> {
        return this.http.put<IWeatherData>(this.resourceUrl, weatherData, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IWeatherData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWeatherData[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
