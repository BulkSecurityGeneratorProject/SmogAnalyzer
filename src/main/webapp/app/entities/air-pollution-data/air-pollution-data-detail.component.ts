import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { AirlyData, IAirlyData } from 'app/shared/model/airly-data.model';
import { AirPollutionDataService } from 'app/entities/air-pollution-data/air-pollution-data.service';
import { JhiAlertService } from 'ng-jhipster';
import { HttpErrorResponse } from '@angular/common/http';
import moment = require('moment');

@Component({
    selector: 'jhi-air-pollution-data-detail',
    templateUrl: './air-pollution-data-detail.component.html'
})
export class AirPollutionDataDetailComponent implements OnInit {
    airPollutionData: IAirPollutionData;
    airlyData: IAirlyData;
    airlyResponse: any;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private airPollutionDataService: AirPollutionDataService,
        protected jhiAlertService: JhiAlertService
    ) {}

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
        const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const entityDate = this.datePipe.transform(this.airPollutionData.date, 'yyyy-MM-dd');

        return !(entityDate < currentDate);
    }

    getDataFromAirly() {
        this.airPollutionDataService
            .getNearestAirlyDataForCoordinates(this.airPollutionData.latitude, this.airPollutionData.longitude)
            .subscribe(
                response => {
                    // console.log(response);
                    this.airlyResponse = response;
                    console.log(this.airlyResponse.current.indexes[0].value);

                    if (this.airlyResponse.current.indexes[0].value === null) {
                        this.jhiAlertService.error('smogAnalyzerApp.airPollutionData.detail.noSensors', null, null);
                    } else {
                        const airPollutionDate = new Date(
                            this.datePipe.transform(this.airPollutionData.date.utc().toDate(), 'y-MM-dd HH:mm')
                        );
                        let fromDateTime;
                        let tillDateTime;
                        this.airlyResponse.history.forEach(data => {
                            fromDateTime = new Date(this.datePipe.transform(data.fromDateTime, 'y-MM-dd HH:mm'));
                            tillDateTime = new Date(this.datePipe.transform(data.tillDateTime, 'y-MM-dd HH:mm'));

                            if (airPollutionDate >= fromDateTime && airPollutionDate <= tillDateTime) {
                                this.createAirlyDataObject(data);
                            }
                        });

                        this.jhiAlertService.success('Gitara', null, null);
                    }
                },
                (response: HttpErrorResponse) => {
                    this.jhiAlertService.error(response.message);
                }
            );
    }

    private createAirlyDataObject(data: any) {
        this.airlyData = new AirlyData();
        this.airlyData.date = moment(data.fromDateTime);

        const values = data.values;
        values.forEach(value => {
            switch (value.name) {
                case 'PM25': {
                    this.airlyData.pm25 = value.value;
                    break;
                }
                case 'PM10': {
                    this.airlyData.pm10 = value.value;
                    break;
                }

                case 'HUMIDITY': {
                    this.airlyData.humidity = value.value;
                    break;
                }

                case 'TEMPERATURE': {
                    this.airlyData.temperature = value.value;
                    break;
                }
            }
        });
    }
}
