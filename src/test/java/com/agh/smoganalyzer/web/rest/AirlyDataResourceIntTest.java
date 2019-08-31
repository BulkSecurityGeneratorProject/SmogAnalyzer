package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.SmogAnalyzerApp;

import com.agh.smoganalyzer.domain.AirlyData;
import com.agh.smoganalyzer.repository.AirlyDataRepository;
import com.agh.smoganalyzer.service.AirlyDataService;
import com.agh.smoganalyzer.service.dto.AirlyDataDTO;
import com.agh.smoganalyzer.service.mapper.AirlyDataMapper;
import com.agh.smoganalyzer.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static com.agh.smoganalyzer.web.rest.TestUtil.sameInstant;
import static com.agh.smoganalyzer.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AirlyDataResource REST controller.
 *
 * @see AirlyDataResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmogAnalyzerApp.class)
public class AirlyDataResourceIntTest {

    private static final Integer DEFAULT_PM_25 = 1;
    private static final Integer UPDATED_PM_25 = 2;

    private static final Integer DEFAULT_PM_10 = 1;
    private static final Integer UPDATED_PM_10 = 2;

    private static final Double DEFAULT_TEMPERATURE = 1D;
    private static final Double UPDATED_TEMPERATURE = 2D;

    private static final Double DEFAULT_HUMIDITY = 1D;
    private static final Double UPDATED_HUMIDITY = 2D;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private AirlyDataRepository airlyDataRepository;

    @Autowired
    private AirlyDataMapper airlyDataMapper;

    @Autowired
    private AirlyDataService airlyDataService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restAirlyDataMockMvc;

    private AirlyData airlyData;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AirlyDataResource airlyDataResource = new AirlyDataResource(airlyDataService);
        this.restAirlyDataMockMvc = MockMvcBuilders.standaloneSetup(airlyDataResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AirlyData createEntity(EntityManager em) {
        AirlyData airlyData = new AirlyData()
            .pm25(DEFAULT_PM_25)
            .pm10(DEFAULT_PM_10)
            .temperature(DEFAULT_TEMPERATURE)
            .humidity(DEFAULT_HUMIDITY)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .date(DEFAULT_DATE);
        return airlyData;
    }

    @Before
    public void initTest() {
        airlyData = createEntity(em);
    }

    @Test
    @Transactional
    public void createAirlyData() throws Exception {
        int databaseSizeBeforeCreate = airlyDataRepository.findAll().size();

        // Create the AirlyData
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);
        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isCreated());

        // Validate the AirlyData in the database
        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeCreate + 1);
        AirlyData testAirlyData = airlyDataList.get(airlyDataList.size() - 1);
        assertThat(testAirlyData.getPm25()).isEqualTo(DEFAULT_PM_25);
        assertThat(testAirlyData.getPm10()).isEqualTo(DEFAULT_PM_10);
        assertThat(testAirlyData.getTemperature()).isEqualTo(DEFAULT_TEMPERATURE);
        assertThat(testAirlyData.getHumidity()).isEqualTo(DEFAULT_HUMIDITY);
        assertThat(testAirlyData.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testAirlyData.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testAirlyData.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createAirlyDataWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = airlyDataRepository.findAll().size();

        // Create the AirlyData with an existing ID
        airlyData.setId(1L);
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AirlyData in the database
        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPm25IsRequired() throws Exception {
        int databaseSizeBeforeTest = airlyDataRepository.findAll().size();
        // set the field null
        airlyData.setPm25(null);

        // Create the AirlyData, which fails.
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPm10IsRequired() throws Exception {
        int databaseSizeBeforeTest = airlyDataRepository.findAll().size();
        // set the field null
        airlyData.setPm10(null);

        // Create the AirlyData, which fails.
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTemperatureIsRequired() throws Exception {
        int databaseSizeBeforeTest = airlyDataRepository.findAll().size();
        // set the field null
        airlyData.setTemperature(null);

        // Create the AirlyData, which fails.
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHumidityIsRequired() throws Exception {
        int databaseSizeBeforeTest = airlyDataRepository.findAll().size();
        // set the field null
        airlyData.setHumidity(null);

        // Create the AirlyData, which fails.
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = airlyDataRepository.findAll().size();
        // set the field null
        airlyData.setDate(null);

        // Create the AirlyData, which fails.
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        restAirlyDataMockMvc.perform(post("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAirlyData() throws Exception {
        // Initialize the database
        airlyDataRepository.saveAndFlush(airlyData);

        // Get all the airlyDataList
        restAirlyDataMockMvc.perform(get("/api/airly-data?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(airlyData.getId().intValue())))
            .andExpect(jsonPath("$.[*].pm25").value(hasItem(DEFAULT_PM_25)))
            .andExpect(jsonPath("$.[*].pm10").value(hasItem(DEFAULT_PM_10)))
            .andExpect(jsonPath("$.[*].temperature").value(hasItem(DEFAULT_TEMPERATURE.doubleValue())))
            .andExpect(jsonPath("$.[*].humidity").value(hasItem(DEFAULT_HUMIDITY.doubleValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }
    
    @Test
    @Transactional
    public void getAirlyData() throws Exception {
        // Initialize the database
        airlyDataRepository.saveAndFlush(airlyData);

        // Get the airlyData
        restAirlyDataMockMvc.perform(get("/api/airly-data/{id}", airlyData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(airlyData.getId().intValue()))
            .andExpect(jsonPath("$.pm25").value(DEFAULT_PM_25))
            .andExpect(jsonPath("$.pm10").value(DEFAULT_PM_10))
            .andExpect(jsonPath("$.temperature").value(DEFAULT_TEMPERATURE.doubleValue()))
            .andExpect(jsonPath("$.humidity").value(DEFAULT_HUMIDITY.doubleValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingAirlyData() throws Exception {
        // Get the airlyData
        restAirlyDataMockMvc.perform(get("/api/airly-data/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAirlyData() throws Exception {
        // Initialize the database
        airlyDataRepository.saveAndFlush(airlyData);

        int databaseSizeBeforeUpdate = airlyDataRepository.findAll().size();

        // Update the airlyData
        AirlyData updatedAirlyData = airlyDataRepository.findById(airlyData.getId()).get();
        // Disconnect from session so that the updates on updatedAirlyData are not directly saved in db
        em.detach(updatedAirlyData);
        updatedAirlyData
            .pm25(UPDATED_PM_25)
            .pm10(UPDATED_PM_10)
            .temperature(UPDATED_TEMPERATURE)
            .humidity(UPDATED_HUMIDITY)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .date(UPDATED_DATE);
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(updatedAirlyData);

        restAirlyDataMockMvc.perform(put("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isOk());

        // Validate the AirlyData in the database
        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeUpdate);
        AirlyData testAirlyData = airlyDataList.get(airlyDataList.size() - 1);
        assertThat(testAirlyData.getPm25()).isEqualTo(UPDATED_PM_25);
        assertThat(testAirlyData.getPm10()).isEqualTo(UPDATED_PM_10);
        assertThat(testAirlyData.getTemperature()).isEqualTo(UPDATED_TEMPERATURE);
        assertThat(testAirlyData.getHumidity()).isEqualTo(UPDATED_HUMIDITY);
        assertThat(testAirlyData.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testAirlyData.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testAirlyData.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingAirlyData() throws Exception {
        int databaseSizeBeforeUpdate = airlyDataRepository.findAll().size();

        // Create the AirlyData
        AirlyDataDTO airlyDataDTO = airlyDataMapper.toDto(airlyData);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAirlyDataMockMvc.perform(put("/api/airly-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airlyDataDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AirlyData in the database
        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAirlyData() throws Exception {
        // Initialize the database
        airlyDataRepository.saveAndFlush(airlyData);

        int databaseSizeBeforeDelete = airlyDataRepository.findAll().size();

        // Delete the airlyData
        restAirlyDataMockMvc.perform(delete("/api/airly-data/{id}", airlyData.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AirlyData> airlyDataList = airlyDataRepository.findAll();
        assertThat(airlyDataList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AirlyData.class);
        AirlyData airlyData1 = new AirlyData();
        airlyData1.setId(1L);
        AirlyData airlyData2 = new AirlyData();
        airlyData2.setId(airlyData1.getId());
        assertThat(airlyData1).isEqualTo(airlyData2);
        airlyData2.setId(2L);
        assertThat(airlyData1).isNotEqualTo(airlyData2);
        airlyData1.setId(null);
        assertThat(airlyData1).isNotEqualTo(airlyData2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AirlyDataDTO.class);
        AirlyDataDTO airlyDataDTO1 = new AirlyDataDTO();
        airlyDataDTO1.setId(1L);
        AirlyDataDTO airlyDataDTO2 = new AirlyDataDTO();
        assertThat(airlyDataDTO1).isNotEqualTo(airlyDataDTO2);
        airlyDataDTO2.setId(airlyDataDTO1.getId());
        assertThat(airlyDataDTO1).isEqualTo(airlyDataDTO2);
        airlyDataDTO2.setId(2L);
        assertThat(airlyDataDTO1).isNotEqualTo(airlyDataDTO2);
        airlyDataDTO1.setId(null);
        assertThat(airlyDataDTO1).isNotEqualTo(airlyDataDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(airlyDataMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(airlyDataMapper.fromId(null)).isNull();
    }
}
