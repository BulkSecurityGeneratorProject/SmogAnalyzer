package com.agh.smoganalyzer.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A AirPollutionData.
 */
@Entity
@Table(name = "air_pollution_data")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class AirPollutionData implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "pm_25", nullable = false)
    private Integer pm25;

    @NotNull
    @Column(name = "pm_10", nullable = false)
    private Integer pm10;

    @NotNull
    @Column(name = "temperature", nullable = false)
    private Double temperature;

    @NotNull
    @Column(name = "humidity", nullable = false)
    private Double humidity;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private ZonedDateTime date;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("airPollutionData")
    private User owner;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("airPollutionData")
    private PlaceOfMeasurement placeOfMeasurement;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPm25() {
        return pm25;
    }

    public AirPollutionData pm25(Integer pm25) {
        this.pm25 = pm25;
        return this;
    }

    public void setPm25(Integer pm25) {
        this.pm25 = pm25;
    }

    public Integer getPm10() {
        return pm10;
    }

    public AirPollutionData pm10(Integer pm10) {
        this.pm10 = pm10;
        return this;
    }

    public void setPm10(Integer pm10) {
        this.pm10 = pm10;
    }

    public Double getTemperature() {
        return temperature;
    }

    public AirPollutionData temperature(Double temperature) {
        this.temperature = temperature;
        return this;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public AirPollutionData humidity(Double humidity) {
        this.humidity = humidity;
        return this;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getLatitude() {
        return latitude;
    }

    public AirPollutionData latitude(Double latitude) {
        this.latitude = latitude;
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public AirPollutionData longitude(Double longitude) {
        this.longitude = longitude;
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public AirPollutionData date(ZonedDateTime date) {
        this.date = date;
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public User getOwner() {
        return owner;
    }

    public AirPollutionData owner(User user) {
        this.owner = user;
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public PlaceOfMeasurement getPlaceOfMeasurement() {
        return placeOfMeasurement;
    }

    public AirPollutionData placeOfMeasurement(PlaceOfMeasurement placeOfMeasurement) {
        this.placeOfMeasurement = placeOfMeasurement;
        return this;
    }

    public void setPlaceOfMeasurement(PlaceOfMeasurement placeOfMeasurement) {
        this.placeOfMeasurement = placeOfMeasurement;
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
        AirPollutionData airPollutionData = (AirPollutionData) o;
        if (airPollutionData.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), airPollutionData.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AirPollutionData{" +
            "id=" + getId() +
            ", pm25=" + getPm25() +
            ", pm10=" + getPm10() +
            ", temperature=" + getTemperature() +
            ", humidity=" + getHumidity() +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
