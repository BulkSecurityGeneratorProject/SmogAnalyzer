package com.agh.smoganalyzer.service.mapper;

import com.agh.smoganalyzer.domain.*;
import com.agh.smoganalyzer.service.dto.WeatherApiKeyDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity WeatherApiKey and its DTO WeatherApiKeyDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface WeatherApiKeyMapper extends EntityMapper<WeatherApiKeyDTO, WeatherApiKey> {



    default WeatherApiKey fromId(Long id) {
        if (id == null) {
            return null;
        }
        WeatherApiKey weatherApiKey = new WeatherApiKey();
        weatherApiKey.setId(id);
        return weatherApiKey;
    }
}
