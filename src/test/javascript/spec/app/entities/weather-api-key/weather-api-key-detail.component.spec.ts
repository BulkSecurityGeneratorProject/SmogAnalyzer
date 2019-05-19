/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherApiKeyDetailComponent } from 'app/entities/weather-api-key/weather-api-key-detail.component';
import { WeatherApiKey } from 'app/shared/model/weather-api-key.model';

describe('Component Tests', () => {
    describe('WeatherApiKey Management Detail Component', () => {
        let comp: WeatherApiKeyDetailComponent;
        let fixture: ComponentFixture<WeatherApiKeyDetailComponent>;
        const route = ({ data: of({ weatherApiKey: new WeatherApiKey(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherApiKeyDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(WeatherApiKeyDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeatherApiKeyDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.weatherApiKey).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
