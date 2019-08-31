package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.AirlyData;
import com.agh.smoganalyzer.repository.AirlyDataRepository;
import com.agh.smoganalyzer.service.dto.AirlyDataDTO;
import com.agh.smoganalyzer.service.mapper.AirlyDataMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing AirlyData.
 */
@Service
@Transactional
public class AirlyDataService {

    private final Logger log = LoggerFactory.getLogger(AirlyDataService.class);

    private final AirlyDataRepository airlyDataRepository;

    private final AirlyDataMapper airlyDataMapper;

    public AirlyDataService(AirlyDataRepository airlyDataRepository, AirlyDataMapper airlyDataMapper) {
        this.airlyDataRepository = airlyDataRepository;
        this.airlyDataMapper = airlyDataMapper;
    }

    /**
     * Save a airlyData.
     *
     * @param airlyDataDTO the entity to save
     * @return the persisted entity
     */
    public AirlyDataDTO save(AirlyDataDTO airlyDataDTO) {
        log.debug("Request to save AirlyData : {}", airlyDataDTO);
        AirlyData airlyData = airlyDataMapper.toEntity(airlyDataDTO);
        airlyData = airlyDataRepository.save(airlyData);
        return airlyDataMapper.toDto(airlyData);
    }

    /**
     * Get all the airlyData.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<AirlyDataDTO> findAll(Pageable pageable) {
        log.debug("Request to get all AirlyData");
        return airlyDataRepository.findAll(pageable)
            .map(airlyDataMapper::toDto);
    }


    /**
     * Get one airlyData by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<AirlyDataDTO> findOne(Long id) {
        log.debug("Request to get AirlyData : {}", id);
        return airlyDataRepository.findById(id)
            .map(airlyDataMapper::toDto);
    }

    /**
     * Delete the airlyData by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete AirlyData : {}", id);
        airlyDataRepository.deleteById(id);
    }
}
