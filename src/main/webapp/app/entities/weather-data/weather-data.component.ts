import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWeatherData } from 'app/shared/model/weather-data.model';
import { AccountService } from 'app/core';
import { WeatherDataService } from './weather-data.service';

@Component({
    selector: 'jhi-weather-data',
    templateUrl: './weather-data.component.html'
})
export class WeatherDataComponent implements OnInit, OnDestroy {
    weatherData: IWeatherData[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected weatherDataService: WeatherDataService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.weatherDataService
            .query()
            .pipe(
                filter((res: HttpResponse<IWeatherData[]>) => res.ok),
                map((res: HttpResponse<IWeatherData[]>) => res.body)
            )
            .subscribe(
                (res: IWeatherData[]) => {
                    this.weatherData = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInWeatherData();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IWeatherData) {
        return item.id;
    }

    registerChangeInWeatherData() {
        this.eventSubscriber = this.eventManager.subscribe('weatherDataListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
