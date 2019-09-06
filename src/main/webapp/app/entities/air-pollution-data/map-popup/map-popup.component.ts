import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-map-popup',
    templateUrl: './map-popup.component.html',
    styles: ['./map-popup.component.css']
})
export class MapPopupComponent implements OnInit {
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/streets-v11';
    lat = 37.75;
    lng = -122.41;

    private accessToken = 'pk.eyJ1IjoicmFkb3NsYXdjaXVwZWsiLCJhIjoiY2swODR4YXhiMDBvNDNpbXF0MzFqbGl2eiJ9.IGCo5dt96_oGVNaGkgJntA';

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        mapboxgl.accessToken = this.accessToken;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        });
        // Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
    }

    onClose(): void {
        this.activeModal.close('Closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }
}
