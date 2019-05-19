/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherApiKeyUpdateComponent } from 'app/entities/weather-api-key/weather-api-key-update.component';
import { WeatherApiKeyService } from 'app/entities/weather-api-key/weather-api-key.service';
import { WeatherApiKey } from 'app/shared/model/weather-api-key.model';

describe('Component Tests', () => {
    describe('WeatherApiKey Management Update Component', () => {
        let comp: WeatherApiKeyUpdateComponent;
        let fixture: ComponentFixture<WeatherApiKeyUpdateComponent>;
        let service: WeatherApiKeyService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherApiKeyUpdateComponent]
            })
                .overrideTemplate(WeatherApiKeyUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeatherApiKeyUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeatherApiKeyService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeatherApiKey(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weatherApiKey = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new WeatherApiKey();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.weatherApiKey = entity;
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
