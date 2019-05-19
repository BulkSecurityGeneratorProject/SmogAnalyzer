import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';
import { WeatherApiKeyService } from './weather-api-key.service';

@Component({
    selector: 'jhi-weather-api-key-delete-dialog',
    templateUrl: './weather-api-key-delete-dialog.component.html'
})
export class WeatherApiKeyDeleteDialogComponent {
    weatherApiKey: IWeatherApiKey;

    constructor(
        protected weatherApiKeyService: WeatherApiKeyService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.weatherApiKeyService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'weatherApiKeyListModification',
                content: 'Deleted an weatherApiKey'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-weather-api-key-delete-popup',
    template: ''
})
export class WeatherApiKeyDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weatherApiKey }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(WeatherApiKeyDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.weatherApiKey = weatherApiKey;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/weather-api-key', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/weather-api-key', { outlets: { popup: null } }]);
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
