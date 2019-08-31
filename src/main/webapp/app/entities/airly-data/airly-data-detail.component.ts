import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAirlyData } from 'app/shared/model/airly-data.model';

@Component({
    selector: 'jhi-airly-data-detail',
    templateUrl: './airly-data-detail.component.html'
})
export class AirlyDataDetailComponent implements OnInit {
    airlyData: IAirlyData;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ airlyData }) => {
            this.airlyData = airlyData;
        });
    }

    previousState() {
        window.history.back();
    }
}
