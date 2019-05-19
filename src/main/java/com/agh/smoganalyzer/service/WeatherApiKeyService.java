package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.WeatherApiKey;
import com.agh.smoganalyzer.repository.WeatherApiKeyRepository;
import com.agh.smoganalyzer.service.dto.WeatherApiKeyDTO;
import com.agh.smoganalyzer.service.mapper.WeatherApiKeyMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing WeatherApiKey.
 */
@Service
@Transactional
public class WeatherApiKeyService {

    private final Logger log = LoggerFactory.getLogger(WeatherApiKeyService.class);

    private final WeatherApiKeyRepository weatherApiKeyRepository;

    private final WeatherApiKeyMapper weatherApiKeyMapper;

    public WeatherApiKeyService(WeatherApiKeyRepository weatherApiKeyRepository, WeatherApiKeyMapper weatherApiKeyMapper) {
        this.weatherApiKeyRepository = weatherApiKeyRepository;
        this.weatherApiKeyMapper = weatherApiKeyMapper;
    }

    /**
     * Save a weatherApiKey.
     *
     * @param weatherApiKeyDTO the entity to save
     * @return the persisted entity
     */
    public WeatherApiKeyDTO save(WeatherApiKeyDTO weatherApiKeyDTO) {
        log.debug("Request to save WeatherApiKey : {}", weatherApiKeyDTO);
        WeatherApiKey weatherApiKey = weatherApiKeyMapper.toEntity(weatherApiKeyDTO);
        weatherApiKey = weatherApiKeyRepository.save(weatherApiKey);
        return weatherApiKeyMapper.toDto(weatherApiKey);
    }

    /**
     * Get all the weatherApiKeys.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<WeatherApiKeyDTO> findAll() {
        log.debug("Request to get all WeatherApiKeys");
        return weatherApiKeyRepository.findAll().stream()
            .map(weatherApiKeyMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one weatherApiKey by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<WeatherApiKeyDTO> findOne(Long id) {
        log.debug("Request to get WeatherApiKey : {}", id);
        return weatherApiKeyRepository.findById(id)
            .map(weatherApiKeyMapper::toDto);
    }

    /**
     * Delete the weatherApiKey by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete WeatherApiKey : {}", id);
        weatherApiKeyRepository.deleteById(id);
    }
}
