import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { AirPollutionDataService } from './air-pollution-data.service';

@Component({
    selector: 'jhi-air-pollution-data-delete-dialog',
    templateUrl: './air-pollution-data-delete-dialog.component.html'
})
export class AirPollutionDataDeleteDialogComponent {
    airPollutionData: IAirPollutionData;

    constructor(
        protected airPollutionDataService: AirPollutionDataService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.airPollutionDataService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'airPollutionDataListModification',
                content: 'Deleted an airPollutionData'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-air-pollution-data-delete-popup',
    template: ''
})
export class AirPollutionDataDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ airPollutionData }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AirPollutionDataDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.airPollutionData = airPollutionData;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/air-pollution-data', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/air-pollution-data', { outlets: { popup: null } }]);
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
