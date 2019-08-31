import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    AirlyDataComponent,
    AirlyDataDetailComponent,
    AirlyDataUpdateComponent,
    AirlyDataDeletePopupComponent,
    AirlyDataDeleteDialogComponent,
    airlyDataRoute,
    airlyDataPopupRoute
} from './';

const ENTITY_STATES = [...airlyDataRoute, ...airlyDataPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AirlyDataComponent,
        AirlyDataDetailComponent,
        AirlyDataUpdateComponent,
        AirlyDataDeleteDialogComponent,
        AirlyDataDeletePopupComponent
    ],
    entryComponents: [AirlyDataComponent, AirlyDataUpdateComponent, AirlyDataDeleteDialogComponent, AirlyDataDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAirlyDataModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
