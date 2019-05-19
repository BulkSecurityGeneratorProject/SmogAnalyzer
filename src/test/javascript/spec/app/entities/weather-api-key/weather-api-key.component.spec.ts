/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherApiKeyComponent } from 'app/entities/weather-api-key/weather-api-key.component';
import { WeatherApiKeyService } from 'app/entities/weather-api-key/weather-api-key.service';
import { WeatherApiKey } from 'app/shared/model/weather-api-key.model';

describe('Component Tests', () => {
    describe('WeatherApiKey Management Component', () => {
        let comp: WeatherApiKeyComponent;
        let fixture: ComponentFixture<WeatherApiKeyComponent>;
        let service: WeatherApiKeyService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherApiKeyComponent],
                providers: []
            })
                .overrideTemplate(WeatherApiKeyComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeatherApiKeyComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeatherApiKeyService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new WeatherApiKey(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.weatherApiKeys[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
