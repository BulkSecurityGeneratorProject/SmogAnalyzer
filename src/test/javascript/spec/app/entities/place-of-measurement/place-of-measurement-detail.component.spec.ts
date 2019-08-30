/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { PlaceOfMeasurementDetailComponent } from 'app/entities/place-of-measurement/place-of-measurement-detail.component';
import { PlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

describe('Component Tests', () => {
    describe('PlaceOfMeasurement Management Detail Component', () => {
        let comp: PlaceOfMeasurementDetailComponent;
        let fixture: ComponentFixture<PlaceOfMeasurementDetailComponent>;
        const route = ({ data: of({ placeOfMeasurement: new PlaceOfMeasurement(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [PlaceOfMeasurementDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PlaceOfMeasurementDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PlaceOfMeasurementDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.placeOfMeasurement).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
