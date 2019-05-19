import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';
import { AccountService } from 'app/core';
import { WeatherApiKeyService } from './weather-api-key.service';

@Component({
    selector: 'jhi-weather-api-key',
    templateUrl: './weather-api-key.component.html'
})
export class WeatherApiKeyComponent implements OnInit, OnDestroy {
    weatherApiKeys: IWeatherApiKey[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected weatherApiKeyService: WeatherApiKeyService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.weatherApiKeyService
            .query()
            .pipe(
                filter((res: HttpResponse<IWeatherApiKey[]>) => res.ok),
                map((res: HttpResponse<IWeatherApiKey[]>) => res.body)
            )
            .subscribe(
                (res: IWeatherApiKey[]) => {
                    this.weatherApiKeys = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInWeatherApiKeys();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IWeatherApiKey) {
        return item.id;
    }

    registerChangeInWeatherApiKeys() {
        this.eventSubscriber = this.eventManager.subscribe('weatherApiKeyListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
