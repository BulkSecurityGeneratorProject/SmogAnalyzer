import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IAirlyData } from 'app/shared/model/airly-data.model';
import { AirlyDataService } from './airly-data.service';

@Component({
    selector: 'jhi-airly-data-update',
    templateUrl: './airly-data-update.component.html'
})
export class AirlyDataUpdateComponent implements OnInit {
    airlyData: IAirlyData;
    isSaving: boolean;
    date: string;

    constructor(protected airlyDataService: AirlyDataService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ airlyData }) => {
            this.airlyData = airlyData;
            this.date = this.airlyData.date != null ? this.airlyData.date.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.airlyData.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.airlyData.id !== undefined) {
            this.subscribeToSaveResponse(this.airlyDataService.update(this.airlyData));
        } else {
            this.subscribeToSaveResponse(this.airlyDataService.create(this.airlyData));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAirlyData>>) {
        result.subscribe((res: HttpResponse<IAirlyData>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
