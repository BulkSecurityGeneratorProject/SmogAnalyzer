import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeatherData } from 'app/shared/model/weather-data.model';

@Component({
    selector: 'jhi-weather-data-detail',
    templateUrl: './weather-data-detail.component.html'
})
export class WeatherDataDetailComponent implements OnInit {
    weatherData: IWeatherData;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weatherData }) => {
            this.weatherData = weatherData;
        });
    }

    previousState() {
        window.history.back();
    }
}
