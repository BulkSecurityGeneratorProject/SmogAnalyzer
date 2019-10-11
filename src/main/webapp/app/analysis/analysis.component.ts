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
    airPollutionData: IAirPollutionData[];
    eventSubscriber: Subscription;
    airPollutonDailyDataFound: IAirPollutionData[];
    airPollutonDailyDataFoundByCity: IAirPollutionData[] = [];

    selectedType: string;
    selectedCity: string;
    dailyTypeDateSelected: string;

    dateDp: any;

    isAirPollutionDataFound: boolean;
    isAirPollutionCityDataFound: boolean;
    isCityFound: boolean;
    trendLinePm25Checked: boolean;
    trendLinePm10Checked: boolean;

    airPollutionDataSize: number;
    selectedCityLongitude: number;
    selectedCityLatitude: number;

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

        this.airPollutonDailyDataFound = this.airPollutionData.filter(
            (data: IAirPollutionData) => this.datePipe.transform(data.date.toDate(), 'yyyy-MM-dd') === selectedDate
        );

        this.isAirPollutionDataFound = this.airPollutonDailyDataFound.length > 0;

        if (!this.isAirPollutionDataFound) {
            this.cities = [];
            this.isCityFound = false;
        }
    }

    getTotalSize(headers: HttpHeaders) {
        return parseInt(headers.get('X-Total-Count'), 10);
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

    getAllCitiesForSelectedDate() {
        this.findAirPollutionDataBySelectedDate();
        this.airPollutonDailyDataFound.forEach(data => {
            this.addCityForCoordinates(data.longitude, data.latitude);
        });
    }

    findAirPollutionDataBySelectedCity() {
        this.airPollutonDailyDataFound.forEach(data => {
            this.getCityByCoordinates(data.longitude, data.latitude).pipe(
                filter((res: HttpResponse<Object>) => res.ok),
                map((res: HttpResponse<Object>) => res.body),
                map((x: any) => {
                    if (x.features[0].text === this.selectedCity) {
                        console.log('znaleziono gowienko');
                        this.airPollutonDailyDataFoundByCity.push(data);
                    }
                })
            );

            // .subscribe((response: any) => {
            //    if (response.features[0].text === this.selectedCity) {
            //        console.log('znaleziono gowienko');
            //        this.airPollutonDailyDataFoundByCity.push(data);
            //    }
            // });
        });
    }

    private getCityByCoordinates(longitude: number, latitude: number): Observable<Object> {
        return this.httpClient.get(this.getMapboxReverseGeocodingUrl(longitude, latitude));
    }

    private addCityForCoordinates(longitude: number, latitude: number) {
        this.httpClient.get(this.getMapboxReverseGeocodingUrl(longitude, latitude)).subscribe((response: any) => {
            const cityName = response.features[0].text;
            if (!this.isCityAlreadyFound(cityName)) {
                this.cities.push(new CityModel(this.cities.length.toString(), cityName));
                this.isCityFound = true;
                this.selectedCity = '0';
                this.selectedCityLongitude = longitude;
                this.selectedCityLatitude = latitude;
            }
        });
    }

    private getMapboxReverseGeocodingUrl(longitude: number, latitude: number) {
        return this.mapboxBaseUrl + longitude + ',' + latitude + '.json?' + 'types=place&' + 'access_token=' + this.mapboxAccessToken;
    }

    private isCityAlreadyFound(cityName: string): boolean {
        return this.cities.filter(city => city.name === cityName).length > 0;
    }
}
