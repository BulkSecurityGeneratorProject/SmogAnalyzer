import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';
import { PlaceOfMeasurementService } from './place-of-measurement.service';

@Component({
    selector: 'jhi-place-of-measurement-update',
    templateUrl: './place-of-measurement-update.component.html'
})
export class PlaceOfMeasurementUpdateComponent implements OnInit {
    placeOfMeasurement: IPlaceOfMeasurement;
    isSaving: boolean;

    constructor(protected placeOfMeasurementService: PlaceOfMeasurementService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ placeOfMeasurement }) => {
            this.placeOfMeasurement = placeOfMeasurement;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.placeOfMeasurement.id !== undefined) {
            this.subscribeToSaveResponse(this.placeOfMeasurementService.update(this.placeOfMeasurement));
        } else {
            this.subscribeToSaveResponse(this.placeOfMeasurementService.create(this.placeOfMeasurement));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaceOfMeasurement>>) {
        result.subscribe((res: HttpResponse<IPlaceOfMeasurement>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
