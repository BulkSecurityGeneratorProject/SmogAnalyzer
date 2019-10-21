import { Component, Input, OnInit } from '@angular/core';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-monthly-charts',
    templateUrl: './monthly-charts.component.html',
    styles: []
})
export class MonthlyChartsComponent implements OnInit {
    _trendLinePm25Checked: boolean;
    _trendLinePm10Checked: boolean;

    data: [Date, number, number][] = [];
    title: string;
    options: any;
    type = 'ScatterChart';
    columnNames = ['Pollution', 'Pm2.5', 'Pm10'];
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

    @Input() monthlyData: IAirPollutionData[];

    constructor(private datePipe: DatePipe, private translateService: TranslateService) {}

    ngOnInit() {
        this.prepareDataToDraw();
    }

    trendlineCheckboxChanged() {
        this.data = Object.assign([], this.data);

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

    private prepareDataToDraw() {
        this.title = this.translateService.instant('analysis.chartTitle');
        const selectedDate = this.datePipe.transform(new Date(this.monthlyData[0].date.toDate()), 'yyyy-MM-dd');
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

        this.monthlyData.sort((a, b) => {
            const dateA = a.date.toDate();
            const dateB = b.date.toDate();

            return <any>new Date(dateA) - <any>new Date(dateB);
        });

        if (this.monthlyData.length === 1) {
            this.data.push([this.monthlyData[0].date.toDate(), this.monthlyData[0].pm25, this.monthlyData[0].pm10]);
            this.options.hAxis.viewWindow = {
                min: new Date(this.monthlyData[0].date.toDate().getTime() - 24 * 3600 * 1000),
                max: new Date(this.monthlyData[0].date.toDate().getTime() + 24 * 3600 * 1000)
            };
        } else {
            this.monthlyData.forEach(e => this.data.push([e.date.toDate(), e.pm25, e.pm10]));
        }
    }
}
