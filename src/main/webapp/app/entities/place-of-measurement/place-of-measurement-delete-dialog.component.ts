import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';
import { PlaceOfMeasurementService } from './place-of-measurement.service';

@Component({
    selector: 'jhi-place-of-measurement-delete-dialog',
    templateUrl: './place-of-measurement-delete-dialog.component.html'
})
export class PlaceOfMeasurementDeleteDialogComponent {
    placeOfMeasurement: IPlaceOfMeasurement;

    constructor(
        protected placeOfMeasurementService: PlaceOfMeasurementService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.placeOfMeasurementService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'placeOfMeasurementListModification',
                content: 'Deleted an placeOfMeasurement'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-place-of-measurement-delete-popup',
    template: ''
})
export class PlaceOfMeasurementDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ placeOfMeasurement }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PlaceOfMeasurementDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.placeOfMeasurement = placeOfMeasurement;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/place-of-measurement', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/place-of-measurement', { outlets: { popup: null } }]);
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
