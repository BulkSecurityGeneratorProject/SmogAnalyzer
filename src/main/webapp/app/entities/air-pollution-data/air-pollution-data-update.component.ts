import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { AirPollutionDataService } from './air-pollution-data.service';

@Component({
    selector: 'jhi-air-pollution-data-update',
    templateUrl: './air-pollution-data-update.component.html'
})
export class AirPollutionDataUpdateComponent implements OnInit {
    airPollutionData: IAirPollutionData;
    isSaving: boolean;
    dateDp: any;

    constructor(protected airPollutionDataService: AirPollutionDataService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ airPollutionData }) => {
            this.airPollutionData = airPollutionData;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
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
}
