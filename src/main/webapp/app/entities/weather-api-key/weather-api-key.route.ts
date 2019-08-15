import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WeatherApiKey } from 'app/shared/model/weather-api-key.model';
import { WeatherApiKeyService } from './weather-api-key.service';
import { WeatherApiKeyComponent } from './weather-api-key.component';
import { WeatherApiKeyDetailComponent } from './weather-api-key-detail.component';
import { WeatherApiKeyUpdateComponent } from './weather-api-key-update.component';
import { WeatherApiKeyDeletePopupComponent } from './weather-api-key-delete-dialog.component';
import { IWeatherApiKey } from 'app/shared/model/weather-api-key.model';

@Injectable({ providedIn: 'root' })
export class WeatherApiKeyResolve implements Resolve<IWeatherApiKey> {
    constructor(private service: WeatherApiKeyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWeatherApiKey> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<WeatherApiKey>) => response.ok),
                map((weatherApiKey: HttpResponse<WeatherApiKey>) => weatherApiKey.body)
            );
        }
        return of(new WeatherApiKey());
    }
}

export const weatherApiKeyRoute: Routes = [
    {
        path: '',
        component: WeatherApiKeyComponent,
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherApiKey.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: WeatherApiKeyDetailComponent,
        resolve: {
            weatherApiKey: WeatherApiKeyResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'smogAnalyzerApp.weatherApiKey.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: WeatherApiKeyUpdateComponent,
        resolve: {
            weatherApiKey: WeatherApiKeyResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'smogAnalyzerApp.weatherApiKey.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: WeatherApiKeyUpdateComponent,
        resolve: {
            weatherApiKey: WeatherApiKeyResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'smogAnalyzerApp.weatherApiKey.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weatherApiKeyPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: WeatherApiKeyDeletePopupComponent,
        resolve: {
            weatherApiKey: WeatherApiKeyResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'smogAnalyzerApp.weatherApiKey.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
