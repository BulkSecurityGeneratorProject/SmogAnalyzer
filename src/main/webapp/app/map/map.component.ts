import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapPopupService } from 'app/entities/air-pollution-data/map-popup/map-popup-service';
import { Observable } from 'rxjs';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AirPollutionDataService } from 'app/entities/air-pollution-data';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html',
    styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/streets-v11';
    lng: number;
    lat: number;
    airPollutionDataSize: number;
    airPollutionData: IAirPollutionData[];

    private accessToken = 'pk.eyJ1IjoicmFkb3NsYXdjaXVwZWsiLCJhIjoiY2swODR4YXhiMDBvNDNpbXF0MzFqbGl2eiJ9.IGCo5dt96_oGVNaGkgJntA';

    constructor(
        private mapPopupService: MapPopupService,
        private airPollutionDataService: AirPollutionDataService,
        private jhiAlertService: JhiAlertService
    ) {}

    ngOnInit() {
        Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.accessToken);
        this.lng = 19.942538;
        this.lat = 50.060753;
        this.initializeMap();
    }

    private initializeMap() {
        this.buildMap();
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 10,
            center: [this.lng, this.lat]
        });
        this.loadAllAirPollutionData();
        // new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(this.map);
    }

    loadAllAirPollutionData() {
        return this.getAirPollutionDataSize()
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
                            this.airPollutionData.forEach(data => {
                                new mapboxgl.Marker().setLngLat([data.longitude, data.latitude]).addTo(this.map);
                            });
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
}
