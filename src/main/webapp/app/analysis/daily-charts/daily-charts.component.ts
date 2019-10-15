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
    _trendLinePm25Checked: boolean;
    _trendLinePm10Checked: boolean;

    // @Input set trendLinePm25Checked(trendLinePm25Checked: boolean)

    data: [Date, number, number][] = [];
    title: string;
    type = 'ScatterChart';
    columnNames = ['Pollution', 'Pm2.5', 'Pm10'];
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
                title: selectedDate.toString(),
                format: 'HH:mm'
            },
            vAxis: {
                title: this.translateService.instant('analysis.airPollution')
            },
            pointSize: 5
        };

        // this.trendLinePm25Checked = true;

        // if (this.trendLinePm25Checked) {
        //     this.options.trendlines = { 0: {} };
        // }

        this.dailyData.sort((a, b) => {
            const dateA = a.date.toDate();
            const dateB = b.date.toDate();

            return <any>new Date(dateA) - <any>new Date(dateB);
        });

        this.dailyData.forEach(e => this.data.push([e.date.toDate(), e.pm25, e.pm10]));
    }
}
