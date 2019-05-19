export class WeatherItem {
    constructor(
        private city: string,
        private icon: string,
        private description: string,
        private temperature: number,
        private pressure: number,
        private humidity: number,
        private windSpeed: number,
        private windDeg: number
    ) {
        this.city = city;
        this.icon = icon;
        this.description = description;
        this.temperature = temperature;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.windDeg = windDeg;
    }
}
