import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';
import { WeatherApiKeyService } from './weather-api-key.service';

@Component({
    selector: 'jhi-weather-api-key-update',
    templateUrl: './weather-api-key-update.component.html'
})
export class WeatherApiKeyUpdateComponent implements OnInit {
    weatherApiKey: IWeatherApiKey;
    isSaving: boolean;

    constructor(protected weatherApiKeyService: WeatherApiKeyService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weatherApiKey }) => {
            this.weatherApiKey = weatherApiKey;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.weatherApiKey.id !== undefined) {
            this.subscribeToSaveResponse(this.weatherApiKeyService.update(this.weatherApiKey));
        } else {
            this.subscribeToSaveResponse(this.weatherApiKeyService.create(this.weatherApiKey));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeatherApiKey>>) {
        result.subscribe((res: HttpResponse<IWeatherApiKey>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
