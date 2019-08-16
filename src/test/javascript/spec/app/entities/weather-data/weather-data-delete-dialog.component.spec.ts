/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherDataDeleteDialogComponent } from 'app/entities/weather-data/weather-data-delete-dialog.component';
import { WeatherDataService } from 'app/entities/weather-data/weather-data.service';

describe('Component Tests', () => {
    describe('WeatherData Management Delete Component', () => {
        let comp: WeatherDataDeleteDialogComponent;
        let fixture: ComponentFixture<WeatherDataDeleteDialogComponent>;
        let service: WeatherDataService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherDataDeleteDialogComponent]
            })
                .overrideTemplate(WeatherDataDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeatherDataDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeatherDataService);
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
