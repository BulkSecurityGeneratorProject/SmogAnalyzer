/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherDataUpdateComponent } from 'app/entities/weather-data/weather-data-update.component';
import { WeatherDataService } from 'app/entities/weather-data/weather-data.service';
import { WeatherData } from 'app/shared/model/weather-data.model';

describe('Component Tests', () => {
    describe('WeatherData Management Update Component', () => {
        let comp: WeatherDataUpdateComponent;
        let fixture: ComponentFixture<WeatherDataUpdateComponent>;
        let service: WeatherDataService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherDataUpdateComponent]
            })
                .overrideTemplate(WeatherDataUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeatherDataUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeatherDataService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeatherData(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weatherData = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeatherData();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weatherData = entity;
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
