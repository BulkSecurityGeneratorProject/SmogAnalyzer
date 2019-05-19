package com.agh.smoganalyzer.service.dto;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the WeatherApiKey entity.
 */
public class WeatherApiKeyDTO implements Serializable {

    private Long id;

    @NotNull
    private String apiKey;

    @NotNull
    private String baseUrl;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        WeatherApiKeyDTO weatherApiKeyDTO = (WeatherApiKeyDTO) o;
        if (weatherApiKeyDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), weatherApiKeyDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "WeatherApiKeyDTO{" +
            "id=" + getId() +
            ", apiKey='" + getApiKey() + "'" +
            ", baseUrl='" + getBaseUrl() + "'" +
            "}";
    }
}
