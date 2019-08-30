import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

type EntityResponseType = HttpResponse<IPlaceOfMeasurement>;
type EntityArrayResponseType = HttpResponse<IPlaceOfMeasurement[]>;

@Injectable({ providedIn: 'root' })
export class PlaceOfMeasurementService {
    public resourceUrl = SERVER_API_URL + 'api/place-of-measurements';

    constructor(protected http: HttpClient) {}

    create(placeOfMeasurement: IPlaceOfMeasurement): Observable<EntityResponseType> {
        return this.http.post<IPlaceOfMeasurement>(this.resourceUrl, placeOfMeasurement, { observe: 'response' });
    }

    update(placeOfMeasurement: IPlaceOfMeasurement): Observable<EntityResponseType> {
        return this.http.put<IPlaceOfMeasurement>(this.resourceUrl, placeOfMeasurement, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPlaceOfMeasurement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPlaceOfMeasurement[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
