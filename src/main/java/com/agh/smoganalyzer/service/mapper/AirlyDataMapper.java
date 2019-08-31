package com.agh.smoganalyzer.service.mapper;

import com.agh.smoganalyzer.domain.*;
import com.agh.smoganalyzer.service.dto.AirlyDataDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity AirlyData and its DTO AirlyDataDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AirlyDataMapper extends EntityMapper<AirlyDataDTO, AirlyData> {



    default AirlyData fromId(Long id) {
        if (id == null) {
            return null;
        }
        AirlyData airlyData = new AirlyData();
        airlyData.setId(id);
        return airlyData;
    }
}
