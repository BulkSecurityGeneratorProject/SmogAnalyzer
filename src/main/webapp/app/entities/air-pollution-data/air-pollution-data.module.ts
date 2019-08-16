import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    AirPollutionDataComponent,
    AirPollutionDataDetailComponent,
    AirPollutionDataUpdateComponent,
    AirPollutionDataDeletePopupComponent,
    AirPollutionDataDeleteDialogComponent,
    airPollutionDataRoute,
    airPollutionDataPopupRoute
} from './';

const ENTITY_STATES = [...airPollutionDataRoute, ...airPollutionDataPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AirPollutionDataComponent,
        AirPollutionDataDetailComponent,
        AirPollutionDataUpdateComponent,
        AirPollutionDataDeleteDialogComponent,
        AirPollutionDataDeletePopupComponent
    ],
    entryComponents: [
        AirPollutionDataComponent,
        AirPollutionDataUpdateComponent,
        AirPollutionDataDeleteDialogComponent,
        AirPollutionDataDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAirPollutionDataModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
