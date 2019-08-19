package com.agh.smoganalyzer.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A WeatherData.
 */
@Entity
@Table(name = "weather_data")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WeatherData implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "city")
    private String city;

    @Column(name = "icon")
    private String icon;

    @Column(name = "pressure")
    private Double pressure;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "wind_speed")
    private Double windSpeed;

    @Column(name = "wind_deg")
    private Double windDeg;

    @Column(name = "temp_min")
    private Double tempMin;

    @Column(name = "temp_max")
    private Double tempMax;

    @Column(name = "sunset")
    private Integer sunset;

    @Column(name = "sunrise")
    private Integer sunrise;

    @Column(name = "cloudiness")
    private Integer cloudiness;

    @Column(name = "temp_main")
    private Double tempMain;

    @Column(name = "name")
    private String name;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public WeatherData city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getIcon() {
        return icon;
    }

    public WeatherData icon(String icon) {
        this.icon = icon;
        return this;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Double getPressure() {
        return pressure;
    }

    public WeatherData pressure(Double pressure) {
        this.pressure = pressure;
        return this;
    }

    public void setPressure(Double pressure) {
        this.pressure = pressure;
    }

    public Double getHumidity() {
        return humidity;
    }

    public WeatherData humidity(Double humidity) {
        this.humidity = humidity;
        return this;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getWindSpeed() {
        return windSpeed;
    }

    public WeatherData windSpeed(Double windSpeed) {
        this.windSpeed = windSpeed;
        return this;
    }

    public void setWindSpeed(Double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public Double getWindDeg() {
        return windDeg;
    }

    public WeatherData windDeg(Double windDeg) {
        this.windDeg = windDeg;
        return this;
    }

    public void setWindDeg(Double windDeg) {
        this.windDeg = windDeg;
    }

    public Double getTempMin() {
        return tempMin;
    }

    public WeatherData tempMin(Double tempMin) {
        this.tempMin = tempMin;
        return this;
    }

    public void setTempMin(Double tempMin) {
        this.tempMin = tempMin;
    }

    public Double getTempMax() {
        return tempMax;
    }

    public WeatherData tempMax(Double tempMax) {
        this.tempMax = tempMax;
        return this;
    }

    public void setTempMax(Double tempMax) {
        this.tempMax = tempMax;
    }

    public Integer getSunset() {
        return sunset;
    }

    public WeatherData sunset(Integer sunset) {
        this.sunset = sunset;
        return this;
    }

    public void setSunset(Integer sunset) {
        this.sunset = sunset;
    }

    public Integer getSunrise() {
        return sunrise;
    }

    public WeatherData sunrise(Integer sunrise) {
        this.sunrise = sunrise;
        return this;
    }

    public void setSunrise(Integer sunrise) {
        this.sunrise = sunrise;
    }

    public Integer getCloudiness() {
        return cloudiness;
    }

    public WeatherData cloudiness(Integer cloudiness) {
        this.cloudiness = cloudiness;
        return this;
    }

    public void setCloudiness(Integer cloudiness) {
        this.cloudiness = cloudiness;
    }

    public Double getTempMain() {
        return tempMain;
    }

    public WeatherData tempMain(Double tempMain) {
        this.tempMain = tempMain;
        return this;
    }

    public void setTempMain(Double tempMain) {
        this.tempMain = tempMain;
    }

    public String getName() {
        return name;
    }

    public WeatherData name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        WeatherData weatherData = (WeatherData) o;
        if (weatherData.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), weatherData.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "WeatherData{" +
            "id=" + getId() +
            ", city='" + getCity() + "'" +
            ", icon='" + getIcon() + "'" +
            ", pressure=" + getPressure() +
            ", humidity=" + getHumidity() +
            ", windSpeed=" + getWindSpeed() +
            ", windDeg=" + getWindDeg() +
            ", tempMin=" + getTempMin() +
            ", tempMax=" + getTempMax() +
            ", sunset=" + getSunset() +
            ", sunrise=" + getSunrise() +
            ", cloudiness=" + getCloudiness() +
            ", tempMain=" + getTempMain() +
            ", name='" + getName() + "'" +
            "}";
    }
}
