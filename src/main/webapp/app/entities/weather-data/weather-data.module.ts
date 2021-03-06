import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    WeatherDataComponent,
    WeatherDataDetailComponent,
    WeatherDataUpdateComponent,
    WeatherDataDeletePopupComponent,
    WeatherDataDeleteDialogComponent,
    weatherDataRoute,
    weatherDataPopupRoute
} from './';

const ENTITY_STATES = [...weatherDataRoute, ...weatherDataPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        WeatherDataComponent,
        WeatherDataDetailComponent,
        WeatherDataUpdateComponent,
        WeatherDataDeleteDialogComponent,
        WeatherDataDeletePopupComponent
    ],
    entryComponents: [WeatherDataComponent, WeatherDataUpdateComponent, WeatherDataDeleteDialogComponent, WeatherDataDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerWeatherDataModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
