import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';

@Component({
    selector: 'jhi-weather-api-key-detail',
    templateUrl: './weather-api-key-detail.component.html'
})
export class WeatherApiKeyDetailComponent implements OnInit {
    weatherApiKey: IWeatherApiKey;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weatherApiKey }) => {
            this.weatherApiKey = weatherApiKey;
        });
    }

    previousState() {
        window.history.back();
    }
}
