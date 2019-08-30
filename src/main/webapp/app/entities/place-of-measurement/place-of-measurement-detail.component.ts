import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

@Component({
    selector: 'jhi-place-of-measurement-detail',
    templateUrl: './place-of-measurement-detail.component.html'
})
export class PlaceOfMeasurementDetailComponent implements OnInit {
    placeOfMeasurement: IPlaceOfMeasurement;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ placeOfMeasurement }) => {
            this.placeOfMeasurement = placeOfMeasurement;
        });
    }

    previousState() {
        window.history.back();
    }
}
