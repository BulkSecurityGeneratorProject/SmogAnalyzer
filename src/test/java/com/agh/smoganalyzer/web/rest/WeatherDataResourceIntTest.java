package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.SmogAnalyzerApp;

import com.agh.smoganalyzer.domain.WeatherData;
import com.agh.smoganalyzer.repository.WeatherDataRepository;
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
import java.util.List;


import static com.agh.smoganalyzer.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WeatherDataResource REST controller.
 *
 * @see WeatherDataResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmogAnalyzerApp.class)
public class WeatherDataResourceIntTest {

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_ICON = "AAAAAAAAAA";
    private static final String UPDATED_ICON = "BBBBBBBBBB";

    private static final Double DEFAULT_PRESSURE = 1D;
    private static final Double UPDATED_PRESSURE = 2D;

    private static final Double DEFAULT_HUMIDITY = 1D;
    private static final Double UPDATED_HUMIDITY = 2D;

    private static final Double DEFAULT_WIND_SPEED = 1D;
    private static final Double UPDATED_WIND_SPEED = 2D;

    private static final Double DEFAULT_WIND_DEG = 1D;
    private static final Double UPDATED_WIND_DEG = 2D;

    private static final Double DEFAULT_TEMP_MIN = 1D;
    private static final Double UPDATED_TEMP_MIN = 2D;

    private static final Double DEFAULT_TEMP_MAX = 1D;
    private static final Double UPDATED_TEMP_MAX = 2D;

    private static final Integer DEFAULT_SUNSET = 1;
    private static final Integer UPDATED_SUNSET = 2;

    private static final Integer DEFAULT_SUNRISE = 1;
    private static final Integer UPDATED_SUNRISE = 2;

    private static final Integer DEFAULT_CLOUDINESS = 1;
    private static final Integer UPDATED_CLOUDINESS = 2;

    private static final Double DEFAULT_TEMP_MAIN = 1D;
    private static final Double UPDATED_TEMP_MAIN = 2D;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private WeatherDataRepository weatherDataRepository;

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

    private MockMvc restWeatherDataMockMvc;

    private WeatherData weatherData;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WeatherDataResource weatherDataResource = new WeatherDataResource(weatherDataRepository);
        this.restWeatherDataMockMvc = MockMvcBuilders.standaloneSetup(weatherDataResource)
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
    public static WeatherData createEntity(EntityManager em) {
        WeatherData weatherData = new WeatherData()
            .city(DEFAULT_CITY)
            .icon(DEFAULT_ICON)
            .pressure(DEFAULT_PRESSURE)
            .humidity(DEFAULT_HUMIDITY)
            .windSpeed(DEFAULT_WIND_SPEED)
            .windDeg(DEFAULT_WIND_DEG)
            .tempMin(DEFAULT_TEMP_MIN)
            .tempMax(DEFAULT_TEMP_MAX)
            .sunset(DEFAULT_SUNSET)
            .sunrise(DEFAULT_SUNRISE)
            .cloudiness(DEFAULT_CLOUDINESS)
            .tempMain(DEFAULT_TEMP_MAIN)
            .name(DEFAULT_NAME);
        return weatherData;
    }

    @Before
    public void initTest() {
        weatherData = createEntity(em);
    }

    @Test
    @Transactional
    public void createWeatherData() throws Exception {
        int databaseSizeBeforeCreate = weatherDataRepository.findAll().size();

        // Create the WeatherData
        restWeatherDataMockMvc.perform(post("/api/weather-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherData)))
            .andExpect(status().isCreated());

        // Validate the WeatherData in the database
        List<WeatherData> weatherDataList = weatherDataRepository.findAll();
        assertThat(weatherDataList).hasSize(databaseSizeBeforeCreate + 1);
        WeatherData testWeatherData = weatherDataList.get(weatherDataList.size() - 1);
        assertThat(testWeatherData.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testWeatherData.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testWeatherData.getPressure()).isEqualTo(DEFAULT_PRESSURE);
        assertThat(testWeatherData.getHumidity()).isEqualTo(DEFAULT_HUMIDITY);
        assertThat(testWeatherData.getWindSpeed()).isEqualTo(DEFAULT_WIND_SPEED);
        assertThat(testWeatherData.getWindDeg()).isEqualTo(DEFAULT_WIND_DEG);
        assertThat(testWeatherData.getTempMin()).isEqualTo(DEFAULT_TEMP_MIN);
        assertThat(testWeatherData.getTempMax()).isEqualTo(DEFAULT_TEMP_MAX);
        assertThat(testWeatherData.getSunset()).isEqualTo(DEFAULT_SUNSET);
        assertThat(testWeatherData.getSunrise()).isEqualTo(DEFAULT_SUNRISE);
        assertThat(testWeatherData.getCloudiness()).isEqualTo(DEFAULT_CLOUDINESS);
        assertThat(testWeatherData.getTempMain()).isEqualTo(DEFAULT_TEMP_MAIN);
        assertThat(testWeatherData.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createWeatherDataWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = weatherDataRepository.findAll().size();

        // Create the WeatherData with an existing ID
        weatherData.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeatherDataMockMvc.perform(post("/api/weather-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherData)))
            .andExpect(status().isBadRequest());

        // Validate the WeatherData in the database
        List<WeatherData> weatherDataList = weatherDataRepository.findAll();
        assertThat(weatherDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllWeatherData() throws Exception {
        // Initialize the database
        weatherDataRepository.saveAndFlush(weatherData);

        // Get all the weatherDataList
        restWeatherDataMockMvc.perform(get("/api/weather-data?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weatherData.getId().intValue())))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(DEFAULT_ICON.toString())))
            .andExpect(jsonPath("$.[*].pressure").value(hasItem(DEFAULT_PRESSURE.doubleValue())))
            .andExpect(jsonPath("$.[*].humidity").value(hasItem(DEFAULT_HUMIDITY.doubleValue())))
            .andExpect(jsonPath("$.[*].windSpeed").value(hasItem(DEFAULT_WIND_SPEED.doubleValue())))
            .andExpect(jsonPath("$.[*].windDeg").value(hasItem(DEFAULT_WIND_DEG.doubleValue())))
            .andExpect(jsonPath("$.[*].tempMin").value(hasItem(DEFAULT_TEMP_MIN.doubleValue())))
            .andExpect(jsonPath("$.[*].tempMax").value(hasItem(DEFAULT_TEMP_MAX.doubleValue())))
            .andExpect(jsonPath("$.[*].sunset").value(hasItem(DEFAULT_SUNSET)))
            .andExpect(jsonPath("$.[*].sunrise").value(hasItem(DEFAULT_SUNRISE)))
            .andExpect(jsonPath("$.[*].cloudiness").value(hasItem(DEFAULT_CLOUDINESS)))
            .andExpect(jsonPath("$.[*].tempMain").value(hasItem(DEFAULT_TEMP_MAIN.doubleValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getWeatherData() throws Exception {
        // Initialize the database
        weatherDataRepository.saveAndFlush(weatherData);

        // Get the weatherData
        restWeatherDataMockMvc.perform(get("/api/weather-data/{id}", weatherData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(weatherData.getId().intValue()))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()))
            .andExpect(jsonPath("$.icon").value(DEFAULT_ICON.toString()))
            .andExpect(jsonPath("$.pressure").value(DEFAULT_PRESSURE.doubleValue()))
            .andExpect(jsonPath("$.humidity").value(DEFAULT_HUMIDITY.doubleValue()))
            .andExpect(jsonPath("$.windSpeed").value(DEFAULT_WIND_SPEED.doubleValue()))
            .andExpect(jsonPath("$.windDeg").value(DEFAULT_WIND_DEG.doubleValue()))
            .andExpect(jsonPath("$.tempMin").value(DEFAULT_TEMP_MIN.doubleValue()))
            .andExpect(jsonPath("$.tempMax").value(DEFAULT_TEMP_MAX.doubleValue()))
            .andExpect(jsonPath("$.sunset").value(DEFAULT_SUNSET))
            .andExpect(jsonPath("$.sunrise").value(DEFAULT_SUNRISE))
            .andExpect(jsonPath("$.cloudiness").value(DEFAULT_CLOUDINESS))
            .andExpect(jsonPath("$.tempMain").value(DEFAULT_TEMP_MAIN.doubleValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingWeatherData() throws Exception {
        // Get the weatherData
        restWeatherDataMockMvc.perform(get("/api/weather-data/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeatherData() throws Exception {
        // Initialize the database
        weatherDataRepository.saveAndFlush(weatherData);

        int databaseSizeBeforeUpdate = weatherDataRepository.findAll().size();

        // Update the weatherData
        WeatherData updatedWeatherData = weatherDataRepository.findById(weatherData.getId()).get();
        // Disconnect from session so that the updates on updatedWeatherData are not directly saved in db
        em.detach(updatedWeatherData);
        updatedWeatherData
            .city(UPDATED_CITY)
            .icon(UPDATED_ICON)
            .pressure(UPDATED_PRESSURE)
            .humidity(UPDATED_HUMIDITY)
            .windSpeed(UPDATED_WIND_SPEED)
            .windDeg(UPDATED_WIND_DEG)
            .tempMin(UPDATED_TEMP_MIN)
            .tempMax(UPDATED_TEMP_MAX)
            .sunset(UPDATED_SUNSET)
            .sunrise(UPDATED_SUNRISE)
            .cloudiness(UPDATED_CLOUDINESS)
            .tempMain(UPDATED_TEMP_MAIN)
            .name(UPDATED_NAME);

        restWeatherDataMockMvc.perform(put("/api/weather-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWeatherData)))
            .andExpect(status().isOk());

        // Validate the WeatherData in the database
        List<WeatherData> weatherDataList = weatherDataRepository.findAll();
        assertThat(weatherDataList).hasSize(databaseSizeBeforeUpdate);
        WeatherData testWeatherData = weatherDataList.get(weatherDataList.size() - 1);
        assertThat(testWeatherData.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testWeatherData.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testWeatherData.getPressure()).isEqualTo(UPDATED_PRESSURE);
        assertThat(testWeatherData.getHumidity()).isEqualTo(UPDATED_HUMIDITY);
        assertThat(testWeatherData.getWindSpeed()).isEqualTo(UPDATED_WIND_SPEED);
        assertThat(testWeatherData.getWindDeg()).isEqualTo(UPDATED_WIND_DEG);
        assertThat(testWeatherData.getTempMin()).isEqualTo(UPDATED_TEMP_MIN);
        assertThat(testWeatherData.getTempMax()).isEqualTo(UPDATED_TEMP_MAX);
        assertThat(testWeatherData.getSunset()).isEqualTo(UPDATED_SUNSET);
        assertThat(testWeatherData.getSunrise()).isEqualTo(UPDATED_SUNRISE);
        assertThat(testWeatherData.getCloudiness()).isEqualTo(UPDATED_CLOUDINESS);
        assertThat(testWeatherData.getTempMain()).isEqualTo(UPDATED_TEMP_MAIN);
        assertThat(testWeatherData.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingWeatherData() throws Exception {
        int databaseSizeBeforeUpdate = weatherDataRepository.findAll().size();

        // Create the WeatherData

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeatherDataMockMvc.perform(put("/api/weather-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherData)))
            .andExpect(status().isBadRequest());

        // Validate the WeatherData in the database
        List<WeatherData> weatherDataList = weatherDataRepository.findAll();
        assertThat(weatherDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWeatherData() throws Exception {
        // Initialize the database
        weatherDataRepository.saveAndFlush(weatherData);

        int databaseSizeBeforeDelete = weatherDataRepository.findAll().size();

        // Delete the weatherData
        restWeatherDataMockMvc.perform(delete("/api/weather-data/{id}", weatherData.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<WeatherData> weatherDataList = weatherDataRepository.findAll();
        assertThat(weatherDataList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeatherData.class);
        WeatherData weatherData1 = new WeatherData();
        weatherData1.setId(1L);
        WeatherData weatherData2 = new WeatherData();
        weatherData2.setId(weatherData1.getId());
        assertThat(weatherData1).isEqualTo(weatherData2);
        weatherData2.setId(2L);
        assertThat(weatherData1).isNotEqualTo(weatherData2);
        weatherData1.setId(null);
        assertThat(weatherData1).isNotEqualTo(weatherData2);
    }
}
