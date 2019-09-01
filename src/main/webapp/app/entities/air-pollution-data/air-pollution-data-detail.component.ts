import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { IAirlyData } from 'app/shared/model/airly-data.model';

@Component({
    selector: 'jhi-air-pollution-data-detail',
    templateUrl: './air-pollution-data-detail.component.html'
})
export class AirPollutionDataDetailComponent implements OnInit {
    airPollutionData: IAirPollutionData;
    airlyData: IAirlyData;

    constructor(protected activatedRoute: ActivatedRoute, private datePipe: DatePipe) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ airPollutionData }) => {
            this.airPollutionData = airPollutionData;
            this.airlyData = airPollutionData.airlyData;
        });
    }

    previousState() {
        window.history.back();
    }

    checkAirPollutionDataDate(): boolean {
        let currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        let entityDate = this.datePipe.transform(this.airPollutionData.date, 'yyyy-MM-dd');

        return !(entityDate < currentDate);
    }
}
