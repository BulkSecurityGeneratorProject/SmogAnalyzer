import { Component, Input, OnInit } from '@angular/core';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { DatePipe } from '@angular/common';
import { DailyDataModel } from 'app/analysis/daily-charts/daily-data.model';

@Component({
    selector: 'jhi-daily-charts',
    templateUrl: './daily-charts.component.html',
    styles: []
})
export class DailyChartsComponent implements OnInit {
    @Input() dailyData: IAirPollutionData[];

    data: [string, number, number][] = [];
    title = 'Daily data';
    type = 'LineChart';
    columnNames = ['Pollution', 'Pm25', 'Pm10'];
    options: any;
    width = 800;
    height = 500;

    constructor(private datePipe: DatePipe) {}

    ngOnInit() {
        this.prepareDataToDraw();
    }

    prepareDataToDraw() {
        const selectedDate = this.datePipe.transform(new Date(this.dailyData[0].date.toDate()), 'yyyy-MM-dd');
        this.options = {
            hAxis: {
                title: selectedDate.toString()
            },
            vAxis: {
                title: 'Pollution'
            },
            pointSize: 5
        };

        // this.data = this.dailyData.map(d => Array.from(Object.values(d)));
        this.dailyData.forEach(e => this.data.push([e.date.format('hh:mm').toString(), e.pm25, e.pm10]));
    }

    // private createDataRowToDisplay(airPollutionData: IAirPollutionData) {
    //     // return [
    //     //     airPollutionData.date.format('hh:mm').toString(),
    //     //     airPollutionData.pm25,
    //     //     airPollutionData.pm10
    //     // ];
    //
    //     return new DailyDataModel(
    //         airPollutionData.date.format('hh:mm').toString(),
    //         airPollutionData.pm25,
    //         airPollutionData.pm10
    //     );
    // }
}
