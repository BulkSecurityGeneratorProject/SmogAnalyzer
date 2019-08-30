package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.SmogAnalyzerApp;

import com.agh.smoganalyzer.domain.AirPollutionData;
import com.agh.smoganalyzer.domain.User;
import com.agh.smoganalyzer.repository.AirPollutionDataRepository;
import com.agh.smoganalyzer.service.AirPollutionDataService;
import com.agh.smoganalyzer.service.dto.AirPollutionDataDTO;
import com.agh.smoganalyzer.service.mapper.AirPollutionDataMapper;
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
 * Test class for the AirPollutionDataResource REST controller.
 *
 * @see AirPollutionDataResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmogAnalyzerApp.class)
public class AirPollutionDataResourceIntTest {

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
    private AirPollutionDataRepository airPollutionDataRepository;

    @Autowired
    private AirPollutionDataMapper airPollutionDataMapper;

    @Autowired
    private AirPollutionDataService airPollutionDataService;

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

    private MockMvc restAirPollutionDataMockMvc;

    private AirPollutionData airPollutionData;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AirPollutionDataResource airPollutionDataResource = new AirPollutionDataResource(airPollutionDataService);
        this.restAirPollutionDataMockMvc = MockMvcBuilders.standaloneSetup(airPollutionDataResource)
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
    public static AirPollutionData createEntity(EntityManager em) {
        AirPollutionData airPollutionData = new AirPollutionData()
            .pm25(DEFAULT_PM_25)
            .pm10(DEFAULT_PM_10)
            .temperature(DEFAULT_TEMPERATURE)
            .humidity(DEFAULT_HUMIDITY)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .date(DEFAULT_DATE);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        airPollutionData.setOwner(user);
        return airPollutionData;
    }

    @Before
    public void initTest() {
        airPollutionData = createEntity(em);
    }

    @Test
    @Transactional
    public void createAirPollutionData() throws Exception {
        int databaseSizeBeforeCreate = airPollutionDataRepository.findAll().size();

        // Create the AirPollutionData
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);
        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isCreated());

        // Validate the AirPollutionData in the database
        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeCreate + 1);
        AirPollutionData testAirPollutionData = airPollutionDataList.get(airPollutionDataList.size() - 1);
        assertThat(testAirPollutionData.getPm25()).isEqualTo(DEFAULT_PM_25);
        assertThat(testAirPollutionData.getPm10()).isEqualTo(DEFAULT_PM_10);
        assertThat(testAirPollutionData.getTemperature()).isEqualTo(DEFAULT_TEMPERATURE);
        assertThat(testAirPollutionData.getHumidity()).isEqualTo(DEFAULT_HUMIDITY);
        assertThat(testAirPollutionData.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testAirPollutionData.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testAirPollutionData.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createAirPollutionDataWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = airPollutionDataRepository.findAll().size();

        // Create the AirPollutionData with an existing ID
        airPollutionData.setId(1L);
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AirPollutionData in the database
        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPm25IsRequired() throws Exception {
        int databaseSizeBeforeTest = airPollutionDataRepository.findAll().size();
        // set the field null
        airPollutionData.setPm25(null);

        // Create the AirPollutionData, which fails.
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPm10IsRequired() throws Exception {
        int databaseSizeBeforeTest = airPollutionDataRepository.findAll().size();
        // set the field null
        airPollutionData.setPm10(null);

        // Create the AirPollutionData, which fails.
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTemperatureIsRequired() throws Exception {
        int databaseSizeBeforeTest = airPollutionDataRepository.findAll().size();
        // set the field null
        airPollutionData.setTemperature(null);

        // Create the AirPollutionData, which fails.
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHumidityIsRequired() throws Exception {
        int databaseSizeBeforeTest = airPollutionDataRepository.findAll().size();
        // set the field null
        airPollutionData.setHumidity(null);

        // Create the AirPollutionData, which fails.
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = airPollutionDataRepository.findAll().size();
        // set the field null
        airPollutionData.setDate(null);

        // Create the AirPollutionData, which fails.
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        restAirPollutionDataMockMvc.perform(post("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAirPollutionData() throws Exception {
        // Initialize the database
        airPollutionDataRepository.saveAndFlush(airPollutionData);

        // Get all the airPollutionDataList
        restAirPollutionDataMockMvc.perform(get("/api/air-pollution-data?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(airPollutionData.getId().intValue())))
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
    public void getAirPollutionData() throws Exception {
        // Initialize the database
        airPollutionDataRepository.saveAndFlush(airPollutionData);

        // Get the airPollutionData
        restAirPollutionDataMockMvc.perform(get("/api/air-pollution-data/{id}", airPollutionData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(airPollutionData.getId().intValue()))
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
    public void getNonExistingAirPollutionData() throws Exception {
        // Get the airPollutionData
        restAirPollutionDataMockMvc.perform(get("/api/air-pollution-data/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAirPollutionData() throws Exception {
        // Initialize the database
        airPollutionDataRepository.saveAndFlush(airPollutionData);

        int databaseSizeBeforeUpdate = airPollutionDataRepository.findAll().size();

        // Update the airPollutionData
        AirPollutionData updatedAirPollutionData = airPollutionDataRepository.findById(airPollutionData.getId()).get();
        // Disconnect from session so that the updates on updatedAirPollutionData are not directly saved in db
        em.detach(updatedAirPollutionData);
        updatedAirPollutionData
            .pm25(UPDATED_PM_25)
            .pm10(UPDATED_PM_10)
            .temperature(UPDATED_TEMPERATURE)
            .humidity(UPDATED_HUMIDITY)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .date(UPDATED_DATE);
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(updatedAirPollutionData);

        restAirPollutionDataMockMvc.perform(put("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isOk());

        // Validate the AirPollutionData in the database
        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeUpdate);
        AirPollutionData testAirPollutionData = airPollutionDataList.get(airPollutionDataList.size() - 1);
        assertThat(testAirPollutionData.getPm25()).isEqualTo(UPDATED_PM_25);
        assertThat(testAirPollutionData.getPm10()).isEqualTo(UPDATED_PM_10);
        assertThat(testAirPollutionData.getTemperature()).isEqualTo(UPDATED_TEMPERATURE);
        assertThat(testAirPollutionData.getHumidity()).isEqualTo(UPDATED_HUMIDITY);
        assertThat(testAirPollutionData.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testAirPollutionData.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testAirPollutionData.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingAirPollutionData() throws Exception {
        int databaseSizeBeforeUpdate = airPollutionDataRepository.findAll().size();

        // Create the AirPollutionData
        AirPollutionDataDTO airPollutionDataDTO = airPollutionDataMapper.toDto(airPollutionData);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAirPollutionDataMockMvc.perform(put("/api/air-pollution-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(airPollutionDataDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AirPollutionData in the database
        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAirPollutionData() throws Exception {
        // Initialize the database
        airPollutionDataRepository.saveAndFlush(airPollutionData);

        int databaseSizeBeforeDelete = airPollutionDataRepository.findAll().size();

        // Delete the airPollutionData
        restAirPollutionDataMockMvc.perform(delete("/api/air-pollution-data/{id}", airPollutionData.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AirPollutionData> airPollutionDataList = airPollutionDataRepository.findAll();
        assertThat(airPollutionDataList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AirPollutionData.class);
        AirPollutionData airPollutionData1 = new AirPollutionData();
        airPollutionData1.setId(1L);
        AirPollutionData airPollutionData2 = new AirPollutionData();
        airPollutionData2.setId(airPollutionData1.getId());
        assertThat(airPollutionData1).isEqualTo(airPollutionData2);
        airPollutionData2.setId(2L);
        assertThat(airPollutionData1).isNotEqualTo(airPollutionData2);
        airPollutionData1.setId(null);
        assertThat(airPollutionData1).isNotEqualTo(airPollutionData2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AirPollutionDataDTO.class);
        AirPollutionDataDTO airPollutionDataDTO1 = new AirPollutionDataDTO();
        airPollutionDataDTO1.setId(1L);
        AirPollutionDataDTO airPollutionDataDTO2 = new AirPollutionDataDTO();
        assertThat(airPollutionDataDTO1).isNotEqualTo(airPollutionDataDTO2);
        airPollutionDataDTO2.setId(airPollutionDataDTO1.getId());
        assertThat(airPollutionDataDTO1).isEqualTo(airPollutionDataDTO2);
        airPollutionDataDTO2.setId(2L);
        assertThat(airPollutionDataDTO1).isNotEqualTo(airPollutionDataDTO2);
        airPollutionDataDTO1.setId(null);
        assertThat(airPollutionDataDTO1).isNotEqualTo(airPollutionDataDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(airPollutionDataMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(airPollutionDataMapper.fromId(null)).isNull();
    }
}
