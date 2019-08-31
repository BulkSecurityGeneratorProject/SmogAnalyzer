import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAirlyData } from 'app/shared/model/airly-data.model';

type EntityResponseType = HttpResponse<IAirlyData>;
type EntityArrayResponseType = HttpResponse<IAirlyData[]>;

@Injectable({ providedIn: 'root' })
export class AirlyDataService {
    public resourceUrl = SERVER_API_URL + 'api/airly-data';

    constructor(protected http: HttpClient) {}

    create(airlyData: IAirlyData): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(airlyData);
        return this.http
            .post<IAirlyData>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(airlyData: IAirlyData): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(airlyData);
        return this.http
            .put<IAirlyData>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IAirlyData>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IAirlyData[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(airlyData: IAirlyData): IAirlyData {
        const copy: IAirlyData = Object.assign({}, airlyData, {
            date: airlyData.date != null && airlyData.date.isValid() ? airlyData.date.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((airlyData: IAirlyData) => {
                airlyData.date = airlyData.date != null ? moment(airlyData.date) : null;
            });
        }
        return res;
    }
}
