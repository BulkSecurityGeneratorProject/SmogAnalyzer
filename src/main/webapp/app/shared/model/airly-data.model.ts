import { Moment } from 'moment';

export interface IAirlyData {
    id?: number;
    pm25?: number;
    pm10?: number;
    temperature?: number;
    humidity?: number;
    latitude?: number;
    longitude?: number;
    date?: Moment;
}

export class AirlyData implements IAirlyData {
    constructor(
        public id?: number,
        public pm25?: number,
        public pm10?: number,
        public temperature?: number,
        public humidity?: number,
        public latitude?: number,
        public longitude?: number,
        public date?: Moment
    ) {}
}
