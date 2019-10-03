import { Component, Input, OnInit } from '@angular/core';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-daily-charts',
    templateUrl: './daily-charts.component.html',
    styles: []
})
export class DailyChartsComponent implements OnInit {
    @Input() dailyData: IAirPollutionData[];

    data: [string, number, number][] = [];
    title: string;
    type = 'LineChart';
    columnNames = ['Pollution', 'Pm25', 'Pm10'];
    options: any;
    width = 1000;
    height = 500;

    constructor(private datePipe: DatePipe, private translateService: TranslateService) {}

    ngOnInit() {
        this.prepareDataToDraw();
    }

    prepareDataToDraw() {
        this.title = this.translateService.instant('analysis.chartTitle');
        const selectedDate = this.datePipe.transform(new Date(this.dailyData[0].date.toDate()), 'yyyy-MM-dd');
        this.options = {
            hAxis: {
                title: selectedDate.toString()
            },
            vAxis: {
                title: this.translateService.instant('analysis.airPollution')
            },
            pointSize: 5
        };

        this.dailyData.forEach(e => this.data.push([e.date.format('hh:mm').toString(), e.pm25, e.pm10]));
    }
}
