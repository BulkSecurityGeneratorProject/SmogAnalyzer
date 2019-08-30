package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.PlaceOfMeasurement;
import com.agh.smoganalyzer.repository.PlaceOfMeasurementRepository;
import com.agh.smoganalyzer.service.dto.PlaceOfMeasurementDTO;
import com.agh.smoganalyzer.service.mapper.PlaceOfMeasurementMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing PlaceOfMeasurement.
 */
@Service
@Transactional
public class PlaceOfMeasurementService {

    private final Logger log = LoggerFactory.getLogger(PlaceOfMeasurementService.class);

    private final PlaceOfMeasurementRepository placeOfMeasurementRepository;

    private final PlaceOfMeasurementMapper placeOfMeasurementMapper;

    public PlaceOfMeasurementService(PlaceOfMeasurementRepository placeOfMeasurementRepository, PlaceOfMeasurementMapper placeOfMeasurementMapper) {
        this.placeOfMeasurementRepository = placeOfMeasurementRepository;
        this.placeOfMeasurementMapper = placeOfMeasurementMapper;
    }

    /**
     * Save a placeOfMeasurement.
     *
     * @param placeOfMeasurementDTO the entity to save
     * @return the persisted entity
     */
    public PlaceOfMeasurementDTO save(PlaceOfMeasurementDTO placeOfMeasurementDTO) {
        log.debug("Request to save PlaceOfMeasurement : {}", placeOfMeasurementDTO);
        PlaceOfMeasurement placeOfMeasurement = placeOfMeasurementMapper.toEntity(placeOfMeasurementDTO);
        placeOfMeasurement = placeOfMeasurementRepository.save(placeOfMeasurement);
        return placeOfMeasurementMapper.toDto(placeOfMeasurement);
    }

    /**
     * Get all the placeOfMeasurements.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<PlaceOfMeasurementDTO> findAll() {
        log.debug("Request to get all PlaceOfMeasurements");
        return placeOfMeasurementRepository.findAll().stream()
            .map(placeOfMeasurementMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one placeOfMeasurement by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<PlaceOfMeasurementDTO> findOne(Long id) {
        log.debug("Request to get PlaceOfMeasurement : {}", id);
        return placeOfMeasurementRepository.findById(id)
            .map(placeOfMeasurementMapper::toDto);
    }

    /**
     * Delete the placeOfMeasurement by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete PlaceOfMeasurement : {}", id);
        placeOfMeasurementRepository.deleteById(id);
    }
}
