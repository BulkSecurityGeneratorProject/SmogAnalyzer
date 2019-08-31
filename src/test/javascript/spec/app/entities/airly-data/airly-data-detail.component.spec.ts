/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmogAnalyzerTestModule } from '../../../test.module';
import { AirlyDataDetailComponent } from 'app/entities/airly-data/airly-data-detail.component';
import { AirlyData } from 'app/shared/model/airly-data.model';

describe('Component Tests', () => {
    describe('AirlyData Management Detail Component', () => {
        let comp: AirlyDataDetailComponent;
        let fixture: ComponentFixture<AirlyDataDetailComponent>;
        const route = ({ data: of({ airlyData: new AirlyData(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmogAnalyzerTestModule],
                declarations: [AirlyDataDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AirlyDataDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AirlyDataDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.airlyData).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
