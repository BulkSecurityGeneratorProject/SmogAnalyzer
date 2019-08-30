import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';
import { AccountService } from 'app/core';
import { PlaceOfMeasurementService } from './place-of-measurement.service';

@Component({
    selector: 'jhi-place-of-measurement',
    templateUrl: './place-of-measurement.component.html'
})
export class PlaceOfMeasurementComponent implements OnInit, OnDestroy {
    placeOfMeasurements: IPlaceOfMeasurement[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected placeOfMeasurementService: PlaceOfMeasurementService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.placeOfMeasurementService
            .query()
            .pipe(
                filter((res: HttpResponse<IPlaceOfMeasurement[]>) => res.ok),
                map((res: HttpResponse<IPlaceOfMeasurement[]>) => res.body)
            )
            .subscribe(
                (res: IPlaceOfMeasurement[]) => {
                    this.placeOfMeasurements = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPlaceOfMeasurements();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPlaceOfMeasurement) {
        return item.id;
    }

    registerChangeInPlaceOfMeasurements() {
        this.eventSubscriber = this.eventManager.subscribe('placeOfMeasurementListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
