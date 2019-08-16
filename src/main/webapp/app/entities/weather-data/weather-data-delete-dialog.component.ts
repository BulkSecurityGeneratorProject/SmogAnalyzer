import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeatherData } from 'app/shared/model/weather-data.model';
import { WeatherDataService } from './weather-data.service';

@Component({
    selector: 'jhi-weather-data-delete-dialog',
    templateUrl: './weather-data-delete-dialog.component.html'
})
export class WeatherDataDeleteDialogComponent {
    weatherData: IWeatherData;

    constructor(
        protected weatherDataService: WeatherDataService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.weatherDataService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'weatherDataListModification',
                content: 'Deleted an weatherData'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-weather-data-delete-popup',
    template: ''
})
export class WeatherDataDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weatherData }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(WeatherDataDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.weatherData = weatherData;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/weather-data', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/weather-data', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
