/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { PlaceOfMeasurementComponent } from 'app/entities/place-of-measurement/place-of-measurement.component';
import { PlaceOfMeasurementService } from 'app/entities/place-of-measurement/place-of-measurement.service';
import { PlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

describe('Component Tests', () => {
    describe('PlaceOfMeasurement Management Component', () => {
        let comp: PlaceOfMeasurementComponent;
        let fixture: ComponentFixture<PlaceOfMeasurementComponent>;
        let service: PlaceOfMeasurementService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [PlaceOfMeasurementComponent],
                providers: []
            })
                .overrideTemplate(PlaceOfMeasurementComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PlaceOfMeasurementComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PlaceOfMeasurementService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PlaceOfMeasurement(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.placeOfMeasurements[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
