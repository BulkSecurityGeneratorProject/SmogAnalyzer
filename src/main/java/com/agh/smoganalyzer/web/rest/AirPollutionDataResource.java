package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.domain.AirPollutionData;
import com.agh.smoganalyzer.repository.AirPollutionDataRepository;
import com.agh.smoganalyzer.service.AirPollutionDataService;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;
import com.agh.smoganalyzer.service.mapper.AirPollutionDataMapper;
import com.agh.smoganalyzer.web.rest.errors.BadRequestAlertException;
import com.agh.smoganalyzer.web.rest.util.HeaderUtil;
import com.agh.smoganalyzer.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AirPollutionData.
 */
@RestController
@RequestMapping("/api")
public class AirPollutionDataResource {

    private final Logger log = LoggerFactory.getLogger(AirPollutionDataResource.class);

    private static final String ENTITY_NAME = "airPollutionData";

    private final AirPollutionDataService airPollutionDataService;
    private final AirPollutionDataMapper airPollutionDataMapper;

    private AirPollutionDataRepository airPollutionDataRepository;

    public AirPollutionDataResource(AirPollutionDataService airPollutionDataService, AirPollutionDataRepository airPollutionDataRepository, AirPollutionDataMapper airPollutionDataMapper) {
        this.airPollutionDataService = airPollutionDataService;
        this.airPollutionDataRepository = airPollutionDataRepository;
        this.airPollutionDataMapper = airPollutionDataMapper;
    }

    /**
     * POST  /air-pollution-data : Create a new airPollutionData.
     *
     * @param airPollutionDataDTO the airPollutionDataDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new airPollutionDataDTO, or with status 400 (Bad Request) if the airPollutionData has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/air-pollution-data")
    public ResponseEntity<AirPollutionDataDTO> createAirPollutionData(@Valid @RequestBody AirPollutionDataDTO airPollutionDataDTO) throws URISyntaxException {
        log.debug("REST request to save AirPollutionData : {}", airPollutionDataDTO);
        if (airPollutionDataDTO.getId() != null) {
            throw new BadRequestAlertException("A new airPollutionData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AirPollutionDataDTO result = airPollutionDataService.save(airPollutionDataDTO);
        return ResponseEntity.created(new URI("/api/air-pollution-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /air-pollution-data : Updates an existing airPollutionData.
     *
     * @param airPollutionDataDTO the airPollutionDataDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated airPollutionDataDTO,
     * or with status 400 (Bad Request) if the airPollutionDataDTO is not valid,
     * or with status 500 (Internal Server Error) if the airPollutionDataDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/air-pollution-data")
    public ResponseEntity<AirPollutionDataDTO> updateAirPollutionData(@Valid @RequestBody AirPollutionDataDTO airPollutionDataDTO) throws URISyntaxException {
        log.debug("REST request to update AirPollutionData : {}", airPollutionDataDTO);
        if (airPollutionDataDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AirPollutionDataDTO result = airPollutionDataService.save(airPollutionDataDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, airPollutionDataDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /air-pollution-data : get all the airPollutionData.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of airPollutionData in body
     */
    @GetMapping("/air-pollution-data")
    public ResponseEntity<List<AirPollutionDataDTO>> getAllAirPollutionData(Pageable pageable) {
        log.debug("REST request to get a page of AirPollutionData");

        Page<AirPollutionDataDTO> page = airPollutionDataRepository.findByOwnerIsCurrentUser(pageable)
            .map(airPollutionDataMapper::toDto);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/air-pollution-data");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/air-pollution-data/all")
    public List<AirPollutionDataDTO> getAllAirPollutionDataNoPagination() {
        log.debug("REST request to get all of AirPollutionData");
        return airPollutionDataService.findAllNoPagination();
    }

    /**
     * GET  /air-pollution-data/:id : get the "id" airPollutionData.
     *
     * @param id the id of the airPollutionDataDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the airPollutionDataDTO, or with status 404 (Not Found)
     */
    @GetMapping("/air-pollution-data/{id}")
    public ResponseEntity<AirPollutionDataDTO> getAirPollutionData(@PathVariable Long id) {
        log.debug("REST request to get AirPollutionData : {}", id);
        Optional<AirPollutionDataDTO> airPollutionDataDTO = airPollutionDataService.findOne(id);
        return ResponseUtil.wrapOrNotFound(airPollutionDataDTO);
    }

    /**
     * DELETE  /air-pollution-data/:id : delete the "id" airPollutionData.
     *
     * @param id the id of the airPollutionDataDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/air-pollution-data/{id}")
    public ResponseEntity<Void> deleteAirPollutionData(@PathVariable Long id) {
        log.debug("REST request to delete AirPollutionData : {}", id);
        airPollutionDataService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/air-pollution-data/file-upload")
    public ResponseEntity<String> createAirPollutionDataFromFile(@RequestParam("file") MultipartFile file) {
        log.debug("REST request to create AirPollutionData from file: ", file.getName());
        airPollutionDataService.saveDataFromFile(file);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME,
            "File successfully saved in database!")).build();

    }

    private AirPollutionDataDTO convertToDto(AirPollutionData airPollutionData) {
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(airPollutionData, AirPollutionDataDTO.class);
    }
}
