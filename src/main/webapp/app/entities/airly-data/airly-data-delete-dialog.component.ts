import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAirlyData } from 'app/shared/model/airly-data.model';
import { AirlyDataService } from './airly-data.service';

@Component({
    selector: 'jhi-airly-data-delete-dialog',
    templateUrl: './airly-data-delete-dialog.component.html'
})
export class AirlyDataDeleteDialogComponent {
    airlyData: IAirlyData;

    constructor(
        protected airlyDataService: AirlyDataService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.airlyDataService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'airlyDataListModification',
                content: 'Deleted an airlyData'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-airly-data-delete-popup',
    template: ''
})
export class AirlyDataDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ airlyData }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AirlyDataDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.airlyData = airlyData;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/airly-data', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/airly-data', { outlets: { popup: null } }]);
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
