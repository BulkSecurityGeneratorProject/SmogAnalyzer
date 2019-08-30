import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { AirPollutionDataService } from './air-pollution-data.service';
import { IUser, UserService } from 'app/core';
import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';
import { PlaceOfMeasurementService } from 'app/entities/place-of-measurement';

@Component({
    selector: 'jhi-air-pollution-data-update',
    templateUrl: './air-pollution-data-update.component.html'
})
export class AirPollutionDataUpdateComponent implements OnInit {
    airPollutionData: IAirPollutionData;
    isSaving: boolean;

    users: IUser[];

    placeofmeasurements: IPlaceOfMeasurement[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected airPollutionDataService: AirPollutionDataService,
        protected userService: UserService,
        protected placeOfMeasurementService: PlaceOfMeasurementService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ airPollutionData }) => {
            this.airPollutionData = airPollutionData;
            this.date = this.airPollutionData.date != null ? this.airPollutionData.date.format(DATE_TIME_FORMAT) : null;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.placeOfMeasurementService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPlaceOfMeasurement[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPlaceOfMeasurement[]>) => response.body)
            )
            .subscribe(
                (res: IPlaceOfMeasurement[]) => (this.placeofmeasurements = res),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.airPollutionData.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.airPollutionData.id !== undefined) {
            this.subscribeToSaveResponse(this.airPollutionDataService.update(this.airPollutionData));
        } else {
            this.subscribeToSaveResponse(this.airPollutionDataService.create(this.airPollutionData));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAirPollutionData>>) {
        result.subscribe((res: HttpResponse<IAirPollutionData>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackPlaceOfMeasurementById(index: number, item: IPlaceOfMeasurement) {
        return item.id;
    }
}
