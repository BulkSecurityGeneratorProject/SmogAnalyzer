/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { AirlyDataDeleteDialogComponent } from 'app/entities/airly-data/airly-data-delete-dialog.component';
import { AirlyDataService } from 'app/entities/airly-data/airly-data.service';

describe('Component Tests', () => {
    describe('AirlyData Management Delete Component', () => {
        let comp: AirlyDataDeleteDialogComponent;
        let fixture: ComponentFixture<AirlyDataDeleteDialogComponent>;
        let service: AirlyDataService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [AirlyDataDeleteDialogComponent]
            })
                .overrideTemplate(AirlyDataDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AirlyDataDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AirlyDataService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
