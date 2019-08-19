export interface IWeatherData {
    id?: number;
    city?: string;
    icon?: string;
    pressure?: number;
    humidity?: number;
    windSpeed?: number;
    windDeg?: number;
    tempMin?: number;
    tempMax?: number;
    sunset?: number;
    sunrise?: number;
    cloudiness?: number;
    tempMain?: number;
    name?: string;
}

export class WeatherData implements IWeatherData {
    constructor(
        public id?: number,
        public city?: string,
        public icon?: string,
        public pressure?: number,
        public humidity?: number,
        public windSpeed?: number,
        public windDeg?: number,
        public tempMin?: number,
        public tempMax?: number,
        public sunset?: number,
        public sunrise?: number,
        public cloudiness?: number,
        public tempMain?: number,
        public name?: string
    ) {}
}
