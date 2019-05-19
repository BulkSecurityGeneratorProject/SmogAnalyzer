export interface IWeatherApiKey {
    id?: number;
    apiKey?: string;
    baseUrl?: string;
}

export class WeatherApiKey implements IWeatherApiKey {
    constructor(public id?: number, public apiKey?: string, public baseUrl?: string) {}
}
