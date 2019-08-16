import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IWeatherData } from 'app/shared/model/weather-data.model';
import { WeatherDataService } from './weather-data.service';

@Component({
    selector: 'jhi-weather-data-update',
    templateUrl: './weather-data-update.component.html'
})
export class WeatherDataUpdateComponent implements OnInit {
    weatherData: IWeatherData;
    isSaving: boolean;

    constructor(protected weatherDataService: WeatherDataService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weatherData }) => {
            this.weatherData = weatherData;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.weatherData.id !== undefined) {
            this.subscribeToSaveResponse(this.weatherDataService.update(this.weatherData));
        } else {
            this.subscribeToSaveResponse(this.weatherDataService.create(this.weatherData));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeatherData>>) {
        result.subscribe((res: HttpResponse<IWeatherData>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
