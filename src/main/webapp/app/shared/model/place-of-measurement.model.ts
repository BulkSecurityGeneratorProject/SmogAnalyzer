export interface IPlaceOfMeasurement {
    id?: number;
    name?: string;
}

export class PlaceOfMeasurement implements IPlaceOfMeasurement {
    constructor(public id?: number, public name?: string) {}
}
