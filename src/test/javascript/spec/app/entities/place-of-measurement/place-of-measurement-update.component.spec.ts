/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { PlaceOfMeasurementUpdateComponent } from 'app/entities/place-of-measurement/place-of-measurement-update.component';
import { PlaceOfMeasurementService } from 'app/entities/place-of-measurement/place-of-measurement.service';
import { PlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

describe('Component Tests', () => {
    describe('PlaceOfMeasurement Management Update Component', () => {
        let comp: PlaceOfMeasurementUpdateComponent;
        let fixture: ComponentFixture<PlaceOfMeasurementUpdateComponent>;
        let service: PlaceOfMeasurementService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [PlaceOfMeasurementUpdateComponent]
            })
                .overrideTemplate(PlaceOfMeasurementUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PlaceOfMeasurementUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PlaceOfMeasurementService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PlaceOfMeasurement(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.placeOfMeasurement = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PlaceOfMeasurement();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.placeOfMeasurement = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
