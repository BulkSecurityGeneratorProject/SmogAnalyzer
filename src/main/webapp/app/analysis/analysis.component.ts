import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AirPollutionDataService } from 'app/entities/air-pollution-data';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AnalysisTypeModel } from 'app/shared/model/analysisType.model';
import { DatePipe } from '@angular/common';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CityModel } from 'app/shared/model/city.model';
import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

@Component({
    selector: 'jhi-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['analysis.component.css']
})
export class AnalysisComponent implements OnInit {
    private mapboxAccessToken = 'pk.eyJ1IjoicmFkb3NsYXdjaXVwZWsiLCJhIjoiY2swODR4YXhiMDBvNDNpbXF0MzFqbGl2eiJ9.IGCo5dt96_oGVNaGkgJntA';
    private mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

    typesOfAnalysis: AnalysisTypeModel[] = [{ id: '0', name: 'Daily' }, { id: '1', name: 'Time frame' }];
    places: IPlaceOfMeasurement[] = [{ id: 1102, name: 'Outside' }, { id: 1101, name: 'Inside' }];
    cities: CityModel[] = [];
    monthlyCities: CityModel[] = [];
    airPollutionData: IAirPollutionData[];
    eventSubscriber: Subscription;
    airPollutionDailyDataFound: IAirPollutionData[];
    airPollutionMonthlyDataFound: IAirPollutionData[];
    airPollutionDailyDataFoundByCity: IAirPollutionData[] = [];
    airPollutionMonthlyDataFoundByCity: IAirPollutionData[] = [];

    selectedType: string;
    selectedPlace: string;
    selectedCity: string;
    selectedCityMonthly: string;
    dailyTypeDateSelected: string;
    monthlyTypeDateSelected: string;

    maxPm25: number;
    maxPm10: number;
    maxTemperature: number;
    maxHumidity: number;

    minPm25: number;
    minPm10: number;
    minTemperature: number;
    minHumidity: number;

    averagePm25: number;
    averagePm10: number;
    averageTemperature: number;
    averageHumidity: number;

    stdPm25: number;
    stdPm10: number;
    stdTemperature: number;
    stdHumidity: number;

    dateDp: any;

    isAirPollutionDataFound: boolean;
    isAirPollutionMonthlyDataFound: boolean;
    isAirPollutionCityDataFound: boolean;
    isAirPollutionMonthlyCityDataFound: boolean;
    isCityFound: boolean;
    isMonthlyCityFound: boolean;
    trendLinePm25Checked: boolean;
    trendLinePm10Checked: boolean;

    airPollutionDataSize: number;

    hoveredDate: NgbDate;
    fromDateSelected: NgbDate;
    toDateSelected: NgbDate;

    constructor(
        private airPollutionDataService: AirPollutionDataService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private datePipe: DatePipe,
        private calendar: NgbCalendar,
        private httpClient: HttpClient
    ) {
        // this.fromDateSelected = this.calendar.getToday();
        // this.toDateSelected = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    }

    ngOnInit() {
        this.loadAllAirPollutionData();
        this.registerChangeInAirPollutionData();
        this.selectedType = '0';
    }

    getTotalSize(headers: HttpHeaders) {
        return parseInt(headers.get('X-Total-Count'), 10);
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDateSelected &&
            !this.toDateSelected &&
            this.hoveredDate &&
            date.after(this.fromDateSelected) &&
            date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return date.after(this.fromDateSelected) && date.before(this.toDateSelected);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDateSelected) || date.equals(this.toDateSelected) || this.isInside(date) || this.isHovered(date);
    }

    loadAllAirPollutionData() {
        this.getAirPollutionDataSize()
            .toPromise()
            .then(x => {
                this.airPollutionDataService
                    .query({
                        size: this.airPollutionDataSize
                    })
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
            });
    }

    getAirPollutionDataSize(): Observable<IAirPollutionData[]> {
        return this.airPollutionDataService.queryAll().pipe(
            filter((res: HttpResponse<IAirPollutionData[]>) => res.ok),
            map((res: HttpResponse<IAirPollutionData[]>) => res.body),
            map((res: IAirPollutionData[]) => {
                this.airPollutionDataSize = res.length;
                return res;
            })
        );
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    registerChangeInAirPollutionData() {
        this.eventSubscriber = this.eventManager.subscribe('airPollutionDataListModification', response => this.loadAllAirPollutionData());
    }

    findAirPollutionDataBySelectedDate() {
        const selectedDate = this.datePipe.transform(new Date(this.dailyTypeDateSelected), 'yyyy-MM-dd');

        this.airPollutionDailyDataFound = this.airPollutionData.filter(
            (data: IAirPollutionData) => this.datePipe.transform(data.date.toDate(), 'yyyy-MM-dd') === selectedDate
        );

        this.isAirPollutionDataFound = this.airPollutionDailyDataFound.length > 0;

        if (!this.isAirPollutionDataFound) {
            this.cities = [];
            this.isCityFound = false;
        }
        this.isAirPollutionCityDataFound = false;
        this.selectedCity = null;
    }

    getAllCitiesForSelectedDate() {
        this.findAirPollutionDataBySelectedDate();
        this.airPollutionDailyDataFound.forEach(data => {
            this.addCityForCoordinates(data.longitude, data.latitude);
        });
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDateSelected && !this.toDateSelected) {
            this.fromDateSelected = date;
        } else if (this.fromDateSelected && !this.toDateSelected && date.after(this.fromDateSelected)) {
            this.toDateSelected = date;
        } else {
            this.toDateSelected = null;
            this.fromDateSelected = date;
        }

        if (this.fromDateSelected && this.toDateSelected) {
            this.getAllCitiesForSelectedDateRange();
        }
    }

    async findAirPollutionDataBySelectedCity() {
        this.airPollutionDailyDataFoundByCity = [];
        this.isAirPollutionCityDataFound = false;
        this.trendLinePm10Checked = false;
        this.trendLinePm25Checked = false;

        for (const data of this.airPollutionDailyDataFound) {
            const response = <any>await this.getCityByCoordinates(data.longitude, data.latitude);
            const city = response.features[0].text;
            if (city === this.cities[this.selectedCity].name && data.placeOfMeasurementName === this.selectedPlace) {
                this.airPollutionDailyDataFoundByCity.push(data);
                console.log('hula');
            }
        }

        this.isAirPollutionCityDataFound = this.airPollutionDailyDataFoundByCity.length > 0;
        this.countDataAnalysisVariables(this.airPollutionDailyDataFoundByCity);
    }

    private getCityByCoordinates(longitude: number, latitude: number) {
        return this.httpClient.get(this.getMapboxReverseGeocodingUrl(longitude, latitude)).toPromise();
    }

    private addCityForCoordinates(longitude: number, latitude: number) {
        this.httpClient.get(this.getMapboxReverseGeocodingUrl(longitude, latitude)).subscribe((response: any) => {
            const cityName = response.features[0].text;
            if (!this.isCityAlreadyFound(cityName)) {
                this.cities.push(new CityModel(this.cities.length.toString(), cityName));
                this.isCityFound = true;
            }
        });
    }

    getAllCitiesForSelectedDateRange() {
        this.findAirPollutionDataBySelectedDateRange();
        if (this.isAirPollutionMonthlyDataFound) {
            this.airPollutionMonthlyDataFound.forEach(data => {
                this.addMonthCityForCoordinates(data.longitude, data.latitude);
            });
        }
    }

    findAirPollutionDataBySelectedDateRange() {
        if (this.fromDateSelected && this.toDateSelected) {
            const from = this.datePipe.transform(
                new Date(this.fromDateSelected.year, this.fromDateSelected.month - 1, this.fromDateSelected.day),
                'yyyy-MM-dd'
            );
            const to = this.datePipe.transform(
                new Date(this.toDateSelected.year, this.toDateSelected.month - 1, this.toDateSelected.day),
                'yyyy-MM-dd'
            );

            this.airPollutionMonthlyDataFound = this.airPollutionData.filter(
                (data: IAirPollutionData) =>
                    this.datePipe.transform(data.date.toDate(), 'yyyy-MM-dd') >= from &&
                    this.datePipe.transform(data.date.toDate(), 'yyyy-MM-dd') <= to
            );

            this.isAirPollutionMonthlyDataFound = this.airPollutionMonthlyDataFound.length > 0;

            if (!this.isAirPollutionMonthlyDataFound) {
                this.monthlyCities = [];
                this.isMonthlyCityFound = false;
            }
            // this.isAirPollutionMonthlyCityDataFound = false;
            // this.selectedCityMonthly = null;
        }
    }

    async findMonthlyAirPollutionDataBySelectedCity() {
        this.airPollutionMonthlyDataFoundByCity = [];
        this.isAirPollutionMonthlyCityDataFound = false;
        this.trendLinePm10Checked = false;
        this.trendLinePm25Checked = false;

        console.log(this.selectedCityMonthly);

        for (const data of this.airPollutionMonthlyDataFound) {
            const response = <any>await this.getCityByCoordinates(data.longitude, data.latitude);
            const city = response.features[0].text;
            if (city === this.monthlyCities[this.selectedCityMonthly].name && this.selectedPlace === data.placeOfMeasurementName) {
                this.airPollutionMonthlyDataFoundByCity.push(data);
            }
        }

        this.isAirPollutionMonthlyCityDataFound = this.airPollutionMonthlyDataFoundByCity.length > 0;
        this.countDataAnalysisVariables(this.airPollutionMonthlyDataFoundByCity);
    }

    private addMonthCityForCoordinates(longitude: number, latitude: number) {
        this.httpClient.get(this.getMapboxReverseGeocodingUrl(longitude, latitude)).subscribe((response: any) => {
            const cityName = response.features[0].text;
            if (!this.isMonthlyCityAlreadyFound(cityName)) {
                this.monthlyCities.push(new CityModel(this.monthlyCities.length.toString(), cityName));
                this.isMonthlyCityFound = true;
                console.log(this.monthlyCities);
            }
        });
    }

    private getMapboxReverseGeocodingUrl(longitude: number, latitude: number) {
        return this.mapboxBaseUrl + longitude + ',' + latitude + '.json?' + 'types=place&' + 'access_token=' + this.mapboxAccessToken;
    }

    private isCityAlreadyFound(cityName: string): boolean {
        return this.cities.filter(city => city.name === cityName).length > 0;
    }

    private isMonthlyCityAlreadyFound(cityName: string): boolean {
        return this.monthlyCities.filter(city => city.name === cityName).length > 0;
    }

    onPm25CheckboxSelect() {
        this.trendLinePm25Checked = !this.trendLinePm25Checked;
    }

    onPm10CheckboxSelect() {
        this.trendLinePm10Checked = !this.trendLinePm10Checked;
    }

    onTypeOfAnalysisChanged() {
        this.cities = [];
        this.monthlyCities = [];
        this.trendLinePm25Checked = false;
        this.trendLinePm10Checked = false;
        this.selectedCity = null;
        this.selectedPlace = null;
        this.selectedCityMonthly = null;
        this.airPollutionDailyDataFoundByCity = [];
        this.airPollutionMonthlyDataFoundByCity = [];
        this.airPollutionMonthlyDataFound = [];
        this.dailyTypeDateSelected = null;
        this.monthlyTypeDateSelected = null;
        this.isAirPollutionCityDataFound = false;
        this.isAirPollutionMonthlyCityDataFound = false;
        this.isAirPollutionDataFound = false;
        this.isAirPollutionMonthlyDataFound = false;
        this.fromDateSelected = null;
        this.toDateSelected = null;
    }

    onPlaceChanged() {
        if (this.selectedPlace && this.selectedCity) {
            this.findAirPollutionDataBySelectedCity();
        }
    }

    onPlaceMonthlyChanged() {
        if (this.selectedPlace && this.selectedCityMonthly) {
            this.findMonthlyAirPollutionDataBySelectedCity();
        }
    }

    private countDataAnalysisVariables(dataFoundByCity: IAirPollutionData[]) {
        this.maxPm25 = Math.max(...dataFoundByCity.map(data => data.pm25), 0);
        this.maxPm10 = Math.max(...dataFoundByCity.map(data => data.pm10), 0);
        this.maxTemperature = Math.max(...dataFoundByCity.map(data => data.temperature), 0);
        this.maxHumidity = Math.max(...dataFoundByCity.map(data => data.humidity), 0);

        this.minPm25 = Math.min(...dataFoundByCity.map(data => data.pm25), 999);
        this.minPm10 = Math.min(...dataFoundByCity.map(data => data.pm10), 999);
        this.minTemperature = Math.min(...dataFoundByCity.map(data => data.temperature), 999);
        this.minHumidity = Math.min(...dataFoundByCity.map(data => data.humidity), 999);

        let sumPm25 = 0;
        let sumPm10 = 0;
        let sumTemperature = 0;
        let sumHumidity = 0;

        dataFoundByCity.forEach(data => {
            sumPm25 = sumPm25 + data.pm25;
            sumPm10 = sumPm10 + data.pm10;
            sumTemperature = sumTemperature + data.temperature;
            sumHumidity = sumHumidity + data.humidity;
        });
        this.averagePm25 = sumPm25 / dataFoundByCity.length;
        this.averagePm10 = sumPm10 / dataFoundByCity.length;
        this.averageTemperature = sumTemperature / dataFoundByCity.length;
        this.averageHumidity = sumHumidity / dataFoundByCity.length;

        let sumDiffPm25 = 0;
        let sumDiffPm10 = 0;
        let sumDiffTemperature = 0;
        let sumDiffHumidity = 0;
        dataFoundByCity.forEach(data => {
            const diffPm25 = data.pm25 - this.averagePm25;
            const diffPm10 = data.pm10 - this.averagePm10;
            const diffTemperature = data.temperature - this.averageTemperature;
            const diffHumidity = data.humidity - this.averageHumidity;

            sumDiffPm25 = sumDiffPm25 + diffPm25 * diffPm25;
            sumDiffPm10 = sumDiffPm10 + diffPm10 * diffPm10;
            sumDiffTemperature = sumDiffTemperature + diffTemperature * diffTemperature;
            sumDiffHumidity = sumDiffHumidity + diffHumidity * diffHumidity;
        });

        const avgSquareDiffPm25 = sumDiffPm25 / dataFoundByCity.length;
        const avgSquareDiffPm10 = sumDiffPm10 / dataFoundByCity.length;
        const avqSquareDiffTemperature = sumDiffTemperature / dataFoundByCity.length;
        const avqSquareDiffHumidity = sumDiffHumidity / dataFoundByCity.length;

        this.stdPm25 = Math.sqrt(avgSquareDiffPm25);
        this.stdPm10 = Math.sqrt(avgSquareDiffPm10);
        this.stdTemperature = Math.sqrt(avqSquareDiffTemperature);
        this.stdHumidity = Math.sqrt(avqSquareDiffHumidity);
    }
}
