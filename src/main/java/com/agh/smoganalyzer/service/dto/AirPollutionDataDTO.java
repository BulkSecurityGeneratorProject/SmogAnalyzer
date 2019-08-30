package com.agh.smoganalyzer.service.dto;
import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the AirPollutionData entity.
 */
public class AirPollutionDataDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer pm25;

    @NotNull
    private Integer pm10;

    @NotNull
    private Double temperature;

    @NotNull
    private Double humidity;

    private Double latitude;

    private Double longitude;

    @NotNull
    private ZonedDateTime date;


    private Long ownerId;

    private String ownerLogin;

    private Long placeOfMeasurementId;

    private String placeOfMeasurementName;

    public AirPollutionDataDTO(@NotNull Integer pm25, @NotNull Integer pm10, @NotNull Double temperature,
                               @NotNull Double humidity, Double latitude, Double longitude, @NotNull ZonedDateTime date,
                               Long ownerId, String ownerLogin) {
        this.pm25 = pm25;
        this.pm10 = pm10;
        this.temperature = temperature;
        this.humidity = humidity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.ownerId = ownerId;
        this.ownerLogin = ownerLogin;
    }

    public AirPollutionDataDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPm25() {
        return pm25;
    }

    public void setPm25(Integer pm25) {
        this.pm25 = pm25;
    }

    public Integer getPm10() {
        return pm10;
    }

    public void setPm10(Integer pm10) {
        this.pm10 = pm10;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long userId) {
        this.ownerId = userId;
    }

    public String getOwnerLogin() {
        return ownerLogin;
    }

    public void setOwnerLogin(String userLogin) {
        this.ownerLogin = userLogin;
    }

    public Long getPlaceOfMeasurementId() {
        return placeOfMeasurementId;
    }

    public void setPlaceOfMeasurementId(Long placeOfMeasurementId) {
        this.placeOfMeasurementId = placeOfMeasurementId;
    }

    public String getPlaceOfMeasurementName() {
        return placeOfMeasurementName;
    }

    public void setPlaceOfMeasurementName(String placeOfMeasurementName) {
        this.placeOfMeasurementName = placeOfMeasurementName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AirPollutionDataDTO airPollutionDataDTO = (AirPollutionDataDTO) o;
        if (airPollutionDataDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), airPollutionDataDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AirPollutionDataDTO{" +
            "id=" + getId() +
            ", pm25=" + getPm25() +
            ", pm10=" + getPm10() +
            ", temperature=" + getTemperature() +
            ", humidity=" + getHumidity() +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", date='" + getDate() + "'" +
            ", owner=" + getOwnerId() +
            ", owner='" + getOwnerLogin() + "'" +
            ", placeOfMeasurement=" + getPlaceOfMeasurementId() +
            ", placeOfMeasurement='" + getPlaceOfMeasurementName() + "'" +
            "}";
    }
}
