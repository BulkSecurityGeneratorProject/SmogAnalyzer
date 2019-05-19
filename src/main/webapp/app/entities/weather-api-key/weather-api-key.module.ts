import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    WeatherApiKeyComponent,
    WeatherApiKeyDetailComponent,
    WeatherApiKeyUpdateComponent,
    WeatherApiKeyDeletePopupComponent,
    WeatherApiKeyDeleteDialogComponent,
    weatherApiKeyRoute,
    weatherApiKeyPopupRoute
} from './';

const ENTITY_STATES = [...weatherApiKeyRoute, ...weatherApiKeyPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        WeatherApiKeyComponent,
        WeatherApiKeyDetailComponent,
        WeatherApiKeyUpdateComponent,
        WeatherApiKeyDeleteDialogComponent,
        WeatherApiKeyDeletePopupComponent
    ],
    entryComponents: [
        WeatherApiKeyComponent,
        WeatherApiKeyUpdateComponent,
        WeatherApiKeyDeleteDialogComponent,
        WeatherApiKeyDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerWeatherApiKeyModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
