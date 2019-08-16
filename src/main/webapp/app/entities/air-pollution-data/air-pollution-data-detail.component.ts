import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';

@Component({
    selector: 'jhi-air-pollution-data-detail',
    templateUrl: './air-pollution-data-detail.component.html'
})
export class AirPollutionDataDetailComponent implements OnInit {
    airPollutionData: IAirPollutionData;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ airPollutionData }) => {
            this.airPollutionData = airPollutionData;
        });
    }

    previousState() {
        window.history.back();
    }
}
