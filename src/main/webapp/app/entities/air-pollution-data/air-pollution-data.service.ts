import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';

type EntityResponseType = HttpResponse<IAirPollutionData>;
type EntityArrayResponseType = HttpResponse<IAirPollutionData[]>;

@Injectable({ providedIn: 'root' })
export class AirPollutionDataService {
    public resourceUrl = SERVER_API_URL + 'api/air-pollution-data';
    public fileUploadUrl = this.resourceUrl + '/file-upload';

    constructor(protected http: HttpClient) {}

    create(airPollutionData: IAirPollutionData): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(airPollutionData);
        return this.http
            .post<IAirPollutionData>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(airPollutionData: IAirPollutionData): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(airPollutionData);
        return this.http
            .put<IAirPollutionData>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IAirPollutionData>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IAirPollutionData[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    uploadAirPollutionDataFile(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.fileUploadUrl}`, formData);
    }

    protected convertDateFromClient(airPollutionData: IAirPollutionData): IAirPollutionData {
        const copy: IAirPollutionData = Object.assign({}, airPollutionData, {
            date: airPollutionData.date != null && airPollutionData.date.isValid() ? airPollutionData.date.format(DATE_FORMAT) : null
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
            res.body.forEach((airPollutionData: IAirPollutionData) => {
                airPollutionData.date = airPollutionData.date != null ? moment(airPollutionData.date) : null;
            });
        }
        return res;
    }
}
