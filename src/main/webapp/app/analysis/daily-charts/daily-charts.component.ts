import { Component, Input, OnInit } from '@angular/core';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { GoogleChartComponent } from 'angular-google-charts';

@Component({
    selector: 'jhi-daily-charts',
    templateUrl: './daily-charts.component.html',
    styles: []
})
export class DailyChartsComponent implements OnInit {
    _trendLinePm25Checked: boolean;
    _trendLinePm10Checked: boolean;

    data: [Date, number, number][] = [];
    title: string;
    type = 'ScatterChart';
    columnNames = ['Pollution', 'Pm2.5', 'Pm10'];
    options: any;
    width = 1000;
    height = 500;

    @Input() set trendLinePm25Checked(trendLinePm25Checked: boolean) {
        this._trendLinePm25Checked = trendLinePm25Checked;
        this.trendlineCheckboxChanged();
    }
    @Input() set trendLinePm10Checked(trendLinePm10Checked: boolean) {
        this._trendLinePm10Checked = trendLinePm10Checked;
        this.trendlineCheckboxChanged();
    }

    @Input() dailyData: IAirPollutionData[];

    constructor(private datePipe: DatePipe, private translateService: TranslateService) {}

    ngOnInit() {
        this.prepareDataToDraw();
    }

    trendlineCheckboxChanged() {
        this.data = Object.assign([], this.data);

        console.log('_trendLinePm25Checked' + this._trendLinePm25Checked);
        console.log('_trendLinePm10Checked' + this._trendLinePm10Checked);

        if (this.options) {
            if (this._trendLinePm25Checked && this._trendLinePm10Checked) {
                this.options.trendlines = { 0: {}, 1: {} };
            } else if (this._trendLinePm25Checked && !this._trendLinePm10Checked) {
                this.options.trendlines = { 0: {} };
            } else if (!this._trendLinePm25Checked && this._trendLinePm10Checked) {
                this.options.trendlines = { 1: {} };
            } else {
                this.options.trendlines = {};
            }
        }
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

        if (this._trendLinePm25Checked && this._trendLinePm10Checked) {
            this.options.trendlines = { 0: {}, 1: {} };
        } else if (this._trendLinePm25Checked && !this._trendLinePm10Checked) {
            this.options.trendlines = { 0: {} };
        } else if (!this._trendLinePm25Checked && this._trendLinePm10Checked) {
            this.options.trendlines = { 1: {} };
        } else {
            this.options.trendlines = {};
        }

        this.dailyData.sort((a, b) => {
            const dateA = a.date.toDate();
            const dateB = b.date.toDate();

            return <any>new Date(dateA) - <any>new Date(dateB);
        });

        this.dailyData.forEach(e => this.data.push([e.date.toDate(), e.pm25, e.pm10]));
        this.data = Object.assign([], this.data);
    }
}
