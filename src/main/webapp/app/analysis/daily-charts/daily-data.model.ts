export class DailyDataModel {
    columnName: string;
    pm25: number;
    pm10: number;

    constructor(columnName: string, pm25: number, pm10: number) {
        this.columnName = columnName;
        this.pm25 = pm25;
        this.pm10 = pm10;
    }
}
