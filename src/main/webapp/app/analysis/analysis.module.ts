import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SmogAnalyzerSharedModule } from '../shared';

import { ANALYSIS_ROUTE, AnalysisComponent } from './';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyChartsComponent } from './daily-charts/daily-charts.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { MonthlyChartsComponent } from './monthly-charts/monthly-charts.component';

@NgModule({
    imports: [SmogAnalyzerSharedModule, ReactiveFormsModule, GoogleChartsModule, RouterModule.forRoot([ANALYSIS_ROUTE], { useHash: true })],
    declarations: [AnalysisComponent, DailyChartsComponent, MonthlyChartsComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAppAnalysisModule {}
