package com.agh.smoganalyzer.service.mapper;

import com.agh.smoganalyzer.domain.*;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity AirPollutionData and its DTO AirPollutionDataDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AirPollutionDataMapper extends EntityMapper<AirPollutionDataDTO, AirPollutionData> {

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "owner.login", target = "ownerLogin")
    AirPollutionDataDTO toDto(AirPollutionData airPollutionData);

    @Mapping(source = "ownerId", target = "owner")
    AirPollutionData toEntity(AirPollutionDataDTO airPollutionDataDTO);

    default AirPollutionData fromId(Long id) {
        if (id == null) {
            return null;
        }
        AirPollutionData airPollutionData = new AirPollutionData();
        airPollutionData.setId(id);
        return airPollutionData;
    }
}
