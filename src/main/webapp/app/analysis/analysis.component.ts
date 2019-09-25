import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AirPollutionDataService } from 'app/entities/air-pollution-data';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AnalysisTypeModel } from 'app/analysis/analysisType.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'jhi-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['analysis.component.css']
})
export class AnalysisComponent implements OnInit {
    typesOfAnalysis: AnalysisTypeModel[] = [{ id: '0', name: 'Daily' }, { id: '1', name: 'Monthly' }];
    airPollutionData: IAirPollutionData[];
    eventSubscriber: Subscription;
    selectedType: string;
    dailyTypeDateSelected: string;
    dateDp: any;
    airPollutonDailyDataFound: IAirPollutionData[];

    constructor(
        private airPollutionDataService: AirPollutionDataService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private datePipe: DatePipe
    ) {}

    loadAllAirPollutionData() {
        this.airPollutionDataService
            .query()
            .pipe(
                filter((res: HttpResponse<IAirPollutionData[]>) => res.ok),
                map((res: HttpResponse<IAirPollutionData[]>) => res.body)
            )
            .subscribe(
                (res: IAirPollutionData[]) => {
                    this.airPollutionData = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAllAirPollutionData();
        this.registerChangeInAirPollutionData();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    registerChangeInAirPollutionData() {
        this.eventSubscriber = this.eventManager.subscribe('airPollutionDataListModification', response => this.loadAllAirPollutionData());
    }

    findAirPollutionDataBySelectedDate() {
        const selectedDate = this.datePipe.transform(new Date(this.dailyTypeDateSelected), 'yyyy-MM-dd');

        let airPollutonDailyDataFound = this.airPollutionData.find(
            data => this.datePipe.transform(data.date.toDate(), 'yyyy-MM-dd') === selectedDate
        );
    }
}
