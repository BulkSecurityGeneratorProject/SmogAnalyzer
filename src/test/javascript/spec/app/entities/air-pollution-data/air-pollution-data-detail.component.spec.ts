/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { AirPollutionDataDetailComponent } from 'app/entities/air-pollution-data/air-pollution-data-detail.component';
import { AirPollutionData } from 'app/shared/model/air-pollution-data.model';

describe('Component Tests', () => {
    describe('AirPollutionData Management Detail Component', () => {
        let comp: AirPollutionDataDetailComponent;
        let fixture: ComponentFixture<AirPollutionDataDetailComponent>;
        const route = ({ data: of({ airPollutionData: new AirPollutionData(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [AirPollutionDataDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AirPollutionDataDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AirPollutionDataDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.airPollutionData).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
