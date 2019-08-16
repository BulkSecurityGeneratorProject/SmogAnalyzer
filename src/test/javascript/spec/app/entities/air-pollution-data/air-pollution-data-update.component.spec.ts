/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { AirPollutionDataUpdateComponent } from 'app/entities/air-pollution-data/air-pollution-data-update.component';
import { AirPollutionDataService } from 'app/entities/air-pollution-data/air-pollution-data.service';
import { AirPollutionData } from 'app/shared/model/air-pollution-data.model';

describe('Component Tests', () => {
    describe('AirPollutionData Management Update Component', () => {
        let comp: AirPollutionDataUpdateComponent;
        let fixture: ComponentFixture<AirPollutionDataUpdateComponent>;
        let service: AirPollutionDataService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [AirPollutionDataUpdateComponent]
            })
                .overrideTemplate(AirPollutionDataUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AirPollutionDataUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AirPollutionDataService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new AirPollutionData(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.airPollutionData = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new AirPollutionData();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.airPollutionData = entity;
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
