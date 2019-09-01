package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.AirPollutionData;
import com.agh.smoganalyzer.domain.PlaceOfMeasurement;
import com.agh.smoganalyzer.repository.AirPollutionDataRepository;
import com.agh.smoganalyzer.repository.PlaceOfMeasurementRepository;
import com.agh.smoganalyzer.repository.UserRepository;
import com.agh.smoganalyzer.security.SecurityUtils;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;
import com.agh.smoganalyzer.service.mapper.AirPollutionDataMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * Service Implementation for managing AirPollutionData.
 */
@Service
@Transactional
public class AirPollutionDataService {

    private final Logger log = LoggerFactory.getLogger(AirPollutionDataService.class);
    private static final String INSIDE = "Inside";
    private static final String OUTSIDE = "Outside";

    private final AirPollutionDataRepository airPollutionDataRepository;
    private final UserRepository userRepository;
    private final PlaceOfMeasurementRepository placeOfMeasurementRepository;

    private final AirPollutionDataMapper airPollutionDataMapper;

    private String currentUserLogin;
    private String placeOfMeasurementInsideName;
    private String placeOfMeasurementOutsideName;
    private Long currentUserId;
    private Long placeOfMeasurementInsideId;
    private Long placeOfMeasurementOutsideId;

    public AirPollutionDataService(AirPollutionDataRepository airPollutionDataRepository, AirPollutionDataMapper airPollutionDataMapper,
                                   UserRepository userRepository, PlaceOfMeasurementRepository placeOfMeasurementRepository) {
        this.airPollutionDataRepository = airPollutionDataRepository;
        this.airPollutionDataMapper = airPollutionDataMapper;
        this.userRepository = userRepository;
        this.placeOfMeasurementRepository = placeOfMeasurementRepository;

        Optional<PlaceOfMeasurement> inside = this.placeOfMeasurementRepository.findOneByName(INSIDE);
        inside.ifPresent(in -> {
            this.placeOfMeasurementInsideId = in.getId();
            this.placeOfMeasurementInsideName = in.getName();
        });

        Optional<PlaceOfMeasurement> outside = this.placeOfMeasurementRepository.findOneByName(OUTSIDE);
        outside.ifPresent(out -> {
            this.placeOfMeasurementOutsideId = out.getId();
            this.placeOfMeasurementOutsideName = out.getName();
        });
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

    public void saveDataFromFile(MultipartFile file) {
        try {
            CSVParser parser = CSVFormat.EXCEL.withHeader().parse(new InputStreamReader(file.getInputStream()));
            SecurityUtils.getCurrentUserLogin()
                .flatMap(userRepository::findOneByLogin)
                .ifPresent(user -> {
                    this.currentUserLogin = user.getLogin();
                    this.currentUserId = user.getId();
                });



            parser.forEach(record -> {
                AirPollutionDataDTO airPollutionDataDTO = new AirPollutionDataDTO(
                    Integer.parseInt(record.get(0)),
                    Integer.parseInt(record.get(1)),
                    Double.parseDouble(record.get(2)),
                    Double.parseDouble(record.get(3)),
                    Double.parseDouble(record.get(4)),
                    Double.parseDouble(record.get(5)),
                    getLocalDate(record.get(6)),
                    this.currentUserId,
                    this.currentUserLogin,
                    getPlaceOfMeasurementId(record.get(7)),
                    getPlaceOfMeasurementName(record.get(7))
                );
                save(airPollutionDataDTO);
            });
        } catch (IOException e) {
            log.error("Could not properly save AirPollutionData from file! Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private ZonedDateTime getLocalDate(String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
        return ZonedDateTime.parse(dateTime, formatter);
    }

    private Long getPlaceOfMeasurementId(String name) {
        switch (name) {
            case INSIDE:
                return this.placeOfMeasurementInsideId;
            case OUTSIDE:
                return this.placeOfMeasurementOutsideId;
            default:
                return null;
        }
    }

    private String getPlaceOfMeasurementName(String name) {
        switch (name) {
            case INSIDE:
                return this.placeOfMeasurementInsideName;
            case OUTSIDE:
                return this.placeOfMeasurementOutsideName;
            default:
                return null;
        }
    }
}
