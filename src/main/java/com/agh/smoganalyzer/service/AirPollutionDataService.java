package com.agh.smoganalyzer.service;

import com.agh.smoganalyzer.domain.AirPollutionData;
import com.agh.smoganalyzer.repository.AirPollutionDataRepository;
import com.agh.smoganalyzer.repository.UserRepository;
import com.agh.smoganalyzer.security.SecurityUtils;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;
import com.agh.smoganalyzer.service.mapper.AirPollutionDataMapper;
import org.apache.commons.csv.CSVFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.csv.CSVParser;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    private final UserRepository userRepository;

    private String currentUserLogin;
    private Long currentUserId;


    public AirPollutionDataService(AirPollutionDataRepository airPollutionDataRepository, AirPollutionDataMapper airPollutionDataMapper,
    UserRepository userRepository) {
        this.airPollutionDataRepository = airPollutionDataRepository;
        this.airPollutionDataMapper = airPollutionDataMapper;
        this.userRepository = userRepository;
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
                    this.currentUserLogin
                );
;
                save(airPollutionDataDTO);
            });
        } catch (IOException e) {
            log.error("Could not properly save AirPollutionData from file! Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private LocalDate getLocalDate(String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
        LocalDateTime localDateTime = LocalDateTime.parse(dateTime, formatter);
        return localDateTime.toLocalDate();
    }
}
