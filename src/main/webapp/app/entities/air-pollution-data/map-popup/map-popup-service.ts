import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MapPopupService {
    private _lng: number;
    private _lat: number;

    constructor() {}

    public get lng(): number {
        return this._lng;
    }

    public set lng(value: number) {
        this._lng = value;
    }

    public get lat(): number {
        return this._lat;
    }

    public set lat(value: number) {
        this._lat = value;
    }
}
