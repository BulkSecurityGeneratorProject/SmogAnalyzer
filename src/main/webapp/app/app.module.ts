import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { SmogAnalyzerSharedModule } from 'app/shared';
import { SmogAnalyzerCoreModule } from 'app/core';
import { SmogAnalyzerAppRoutingModule } from './app-routing.module';
import { SmogAnalyzerHomeModule } from './home/home.module';
import { SmogAnalyzerAccountModule } from './account/account.module';
import { SmogAnalyzerEntityModule } from './entities/entity.module';
import * as moment from 'moment';
import { SmogAnalyzerAppAnalysisModule } from './analysis/analysis.module';
import { SmogAnalyzerAppMapModule } from './map/map.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { ActiveMenuDirective, ErrorComponent, FooterComponent, JhiMainComponent, NavbarComponent, PageRibbonComponent } from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000,
            i18nEnabled: true,
            defaultI18nLang: 'pl'
        }),
        SmogAnalyzerSharedModule.forRoot(),
        SmogAnalyzerCoreModule,
        SmogAnalyzerHomeModule,
        SmogAnalyzerAccountModule,
        SmogAnalyzerAppAnalysisModule,
        SmogAnalyzerAppMapModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        SmogAnalyzerEntityModule,
        SmogAnalyzerAppRoutingModule,
        HttpClientModule
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class SmogAnalyzerAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
