package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.AirPollutionData;
import com.agh.smoganalyzer.repository.AirPollutionDataRepository;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;
import com.agh.smoganalyzer.service.mapper.AirPollutionDataMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing AirPollutionData.
 */
@Service
@Transactional
public class AirPollutionDataService {

    private final Logger log = LoggerFactory.getLogger(AirPollutionDataService.class);

    private final AirPollutionDataRepository airPollutionDataRepository;

    private final AirPollutionDataMapper airPollutionDataMapper;

    public AirPollutionDataService(AirPollutionDataRepository airPollutionDataRepository, AirPollutionDataMapper airPollutionDataMapper) {
        this.airPollutionDataRepository = airPollutionDataRepository;
        this.airPollutionDataMapper = airPollutionDataMapper;
    }

    /**
     * Save a airPollutionData.
     *
     * @param airPollutionDataDTO the entity to save
     * @return the persisted entity
     */
    public AirPollutionDataDTO save(AirPollutionDataDTO airPollutionDataDTO) {
        log.debug("Request to save AirPollutionData : {}", airPollutionDataDTO);
        AirPollutionData airPollutionData = airPollutionDataMapper.toEntity(airPollutionDataDTO);
        airPollutionData = airPollutionDataRepository.save(airPollutionData);
        return airPollutionDataMapper.toDto(airPollutionData);
    }

    /**
     * Get all the airPollutionData.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<AirPollutionDataDTO> findAll(Pageable pageable) {
        log.debug("Request to get all AirPollutionData");
        return airPollutionDataRepository.findAll(pageable)
            .map(airPollutionDataMapper::toDto);
    }


    /**
     * Get one airPollutionData by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<AirPollutionDataDTO> findOne(Long id) {
        log.debug("Request to get AirPollutionData : {}", id);
        return airPollutionDataRepository.findById(id)
            .map(airPollutionDataMapper::toDto);
    }

    /**
     * Delete the airPollutionData by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete AirPollutionData : {}", id);
        airPollutionDataRepository.deleteById(id);
    }
}
