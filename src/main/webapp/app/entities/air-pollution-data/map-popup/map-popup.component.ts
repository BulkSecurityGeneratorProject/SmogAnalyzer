import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as mapboxgl from 'mapbox-gl';
import { MapPopupService } from 'app/entities/air-pollution-data/map-popup/map-popup-service';

@Component({
    selector: 'jhi-map-popup',
    templateUrl: './map-popup.component.html',
    styles: []
})
export class MapPopupComponent implements OnInit {
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/streets-v11';
    lng: number;
    lat: number;

    private accessToken = 'pk.eyJ1IjoicmFkb3NsYXdjaXVwZWsiLCJhIjoiY2swODR4YXhiMDBvNDNpbXF0MzFqbGl2eiJ9.IGCo5dt96_oGVNaGkgJntA';

    constructor(public activeModal: NgbActiveModal, private mapPopupService: MapPopupService) {}

    ngOnInit() {
        Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.accessToken);
        this.lng = this.mapPopupService.lng;
        this.lat = this.mapPopupService.lat;
        this.initializeMap();
    }

    private initializeMap() {
        this.buildMap();
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        });

        let marker = new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(this.map);
    }

    onClose(): void {
        this.activeModal.close('Closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }
}
