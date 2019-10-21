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

@Component({
    selector: 'jhi-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['analysis.component.css']
})
export class AnalysisComponent implements OnInit {
    private mapboxAccessToken = 'pk.eyJ1IjoicmFkb3NsYXdjaXVwZWsiLCJhIjoiY2swODR4YXhiMDBvNDNpbXF0MzFqbGl2eiJ9.IGCo5dt96_oGVNaGkgJntA';
    private mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

    typesOfAnalysis: AnalysisTypeModel[] = [{ id: '0', name: 'Daily' }, { id: '1', name: 'Time frame' }];
    cities: CityModel[] = [];
    monthlyCities: CityModel[] = [];
    airPollutionData: IAirPollutionData[];
    eventSubscriber: Subscription;
    airPollutionDailyDataFound: IAirPollutionData[];
    airPollutionMonthlyDataFound: IAirPollutionData[];
    airPollutionDailyDataFoundByCity: IAirPollutionData[] = [];
    airPollutionMonthlyDataFoundByCity: IAirPollutionData[] = [];

    selectedType: string;
    selectedCity: string;
    selectedCityMonthly: string;
    dailyTypeDateSelected: string;
    monthlyTypeDateSelected: string;

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
            if (city === this.cities[this.selectedCity].name) {
                this.airPollutionDailyDataFoundByCity.push(data);
            }
        }

        this.isAirPollutionCityDataFound = this.airPollutionDailyDataFoundByCity.length > 0;
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
            if (city === this.monthlyCities[this.selectedCityMonthly].name) {
                this.airPollutionMonthlyDataFoundByCity.push(data);
            }
        }

        this.isAirPollutionMonthlyCityDataFound = this.airPollutionMonthlyDataFoundByCity.length > 0;
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
}
