package com.agh.smoganalyzer.service.mapper;

import com.agh.smoganalyzer.domain.*;
import com.agh.smoganalyzer.service.dto.PlaceOfMeasurementDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity PlaceOfMeasurement and its DTO PlaceOfMeasurementDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PlaceOfMeasurementMapper extends EntityMapper<PlaceOfMeasurementDTO, PlaceOfMeasurement> {



    default PlaceOfMeasurement fromId(Long id) {
        if (id == null) {
            return null;
        }
        PlaceOfMeasurement placeOfMeasurement = new PlaceOfMeasurement();
        placeOfMeasurement.setId(id);
        return placeOfMeasurement;
    }
}
