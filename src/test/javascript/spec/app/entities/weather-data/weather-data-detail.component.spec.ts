/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { WeatherDataDetailComponent } from 'app/entities/weather-data/weather-data-detail.component';
import { WeatherData } from 'app/shared/model/weather-data.model';

describe('Component Tests', () => {
    describe('WeatherData Management Detail Component', () => {
        let comp: WeatherDataDetailComponent;
        let fixture: ComponentFixture<WeatherDataDetailComponent>;
        const route = ({ data: of({ weatherData: new WeatherData(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [WeatherDataDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(WeatherDataDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeatherDataDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.weatherData).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
