/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { AirlyDataUpdateComponent } from 'app/entities/airly-data/airly-data-update.component';
import { AirlyDataService } from 'app/entities/airly-data/airly-data.service';
import { AirlyData } from 'app/shared/model/airly-data.model';

describe('Component Tests', () => {
    describe('AirlyData Management Update Component', () => {
        let comp: AirlyDataUpdateComponent;
        let fixture: ComponentFixture<AirlyDataUpdateComponent>;
        let service: AirlyDataService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [AirlyDataUpdateComponent]
            })
                .overrideTemplate(AirlyDataUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AirlyDataUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AirlyDataService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new AirlyData(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.airlyData = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new AirlyData();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.airlyData = entity;
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
