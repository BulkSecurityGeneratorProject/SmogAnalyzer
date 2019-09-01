import { Moment } from 'moment';

export interface IAirPollutionData {
    id?: number;
    pm25?: number;
    pm10?: number;
    temperature?: number;
    humidity?: number;
    latitude?: number;
    longitude?: number;
    date?: Moment;
    ownerLogin?: string;
    ownerId?: number;
    placeOfMeasurementName?: string;
    placeOfMeasurementId?: number;
    airlyDataId?: number;
}

export class AirPollutionData implements IAirPollutionData {
    constructor(
        public id?: number,
        public pm25?: number,
        public pm10?: number,
        public temperature?: number,
        public humidity?: number,
        public latitude?: number,
        public longitude?: number,
        public date?: Moment,
        public ownerLogin?: string,
        public ownerId?: number,
        public placeOfMeasurementName?: string,
        public placeOfMeasurementId?: number,
        public airlyDataId?: number
    ) {}
}
