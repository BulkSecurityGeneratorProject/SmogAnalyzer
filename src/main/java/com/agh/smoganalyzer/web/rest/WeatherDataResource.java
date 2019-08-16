package com.agh.smoganalyzer.web.rest;
import com.agh.smoganalyzer.domain.WeatherData;
import com.agh.smoganalyzer.repository.WeatherDataRepository;
import com.agh.smoganalyzer.web.rest.errors.BadRequestAlertException;
import com.agh.smoganalyzer.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing WeatherData.
 */
@RestController
@RequestMapping("/api")
public class WeatherDataResource {

    private final Logger log = LoggerFactory.getLogger(WeatherDataResource.class);

    private static final String ENTITY_NAME = "weatherData";

    private final WeatherDataRepository weatherDataRepository;

    public WeatherDataResource(WeatherDataRepository weatherDataRepository) {
        this.weatherDataRepository = weatherDataRepository;
    }

    /**
     * POST  /weather-data : Create a new weatherData.
     *
     * @param weatherData the weatherData to create
     * @return the ResponseEntity with status 201 (Created) and with body the new weatherData, or with status 400 (Bad Request) if the weatherData has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/weather-data")
    public ResponseEntity<WeatherData> createWeatherData(@RequestBody WeatherData weatherData) throws URISyntaxException {
        log.debug("REST request to save WeatherData : {}", weatherData);
        if (weatherData.getId() != null) {
            throw new BadRequestAlertException("A new weatherData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeatherData result = weatherDataRepository.save(weatherData);
        return ResponseEntity.created(new URI("/api/weather-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /weather-data : Updates an existing weatherData.
     *
     * @param weatherData the weatherData to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated weatherData,
     * or with status 400 (Bad Request) if the weatherData is not valid,
     * or with status 500 (Internal Server Error) if the weatherData couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/weather-data")
    public ResponseEntity<WeatherData> updateWeatherData(@RequestBody WeatherData weatherData) throws URISyntaxException {
        log.debug("REST request to update WeatherData : {}", weatherData);
        if (weatherData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WeatherData result = weatherDataRepository.save(weatherData);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, weatherData.getId().toString()))
            .body(result);
    }

    /**
     * GET  /weather-data : get all the weatherData.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of weatherData in body
     */
    @GetMapping("/weather-data")
    public List<WeatherData> getAllWeatherData() {
        log.debug("REST request to get all WeatherData");
        return weatherDataRepository.findAll();
    }

    /**
     * GET  /weather-data/:id : get the "id" weatherData.
     *
     * @param id the id of the weatherData to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the weatherData, or with status 404 (Not Found)
     */
    @GetMapping("/weather-data/{id}")
    public ResponseEntity<WeatherData> getWeatherData(@PathVariable Long id) {
        log.debug("REST request to get WeatherData : {}", id);
        Optional<WeatherData> weatherData = weatherDataRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(weatherData);
    }

    /**
     * DELETE  /weather-data/:id : delete the "id" weatherData.
     *
     * @param id the id of the weatherData to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/weather-data/{id}")
    public ResponseEntity<Void> deleteWeatherData(@PathVariable Long id) {
        log.debug("REST request to delete WeatherData : {}", id);
        weatherDataRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
