import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WeatherData } from 'app/shared/model/weather-data.model';
import { WeatherDataService } from './weather-data.service';
import { WeatherDataComponent } from './weather-data.component';
import { WeatherDataDetailComponent } from './weather-data-detail.component';
import { WeatherDataUpdateComponent } from './weather-data-update.component';
import { WeatherDataDeletePopupComponent } from './weather-data-delete-dialog.component';
import { IWeatherData } from 'app/shared/model/weather-data.model';

@Injectable({ providedIn: 'root' })
export class WeatherDataResolve implements Resolve<IWeatherData> {
    constructor(private service: WeatherDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWeatherData> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<WeatherData>) => response.ok),
                map((weatherData: HttpResponse<WeatherData>) => weatherData.body)
            );
        }
        return of(new WeatherData());
    }
}

export const weatherDataRoute: Routes = [
    {
        path: '',
        component: WeatherDataComponent,
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: WeatherDataDetailComponent,
        resolve: {
            weatherData: WeatherDataResolve
        },
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: WeatherDataUpdateComponent,
        resolve: {
            weatherData: WeatherDataResolve
        },
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: WeatherDataUpdateComponent,
        resolve: {
            weatherData: WeatherDataResolve
        },
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherData.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weatherDataPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: WeatherDataDeletePopupComponent,
        resolve: {
            weatherData: WeatherDataResolve
        },
        data: {
            authorities: [],
            pageTitle: 'smogAnalyzerApp.weatherData.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
