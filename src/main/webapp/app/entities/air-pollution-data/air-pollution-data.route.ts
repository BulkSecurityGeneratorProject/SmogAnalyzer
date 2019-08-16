import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AirPollutionData } from 'app/shared/model/air-pollution-data.model';
import { AirPollutionDataService } from './air-pollution-data.service';
import { AirPollutionDataComponent } from './air-pollution-data.component';
import { AirPollutionDataDetailComponent } from './air-pollution-data-detail.component';
import { AirPollutionDataUpdateComponent } from './air-pollution-data-update.component';
import { AirPollutionDataDeletePopupComponent } from './air-pollution-data-delete-dialog.component';
import { IAirPollutionData } from 'app/shared/model/air-pollution-data.model';

@Injectable({ providedIn: 'root' })
export class AirPollutionDataResolve implements Resolve<IAirPollutionData> {
    constructor(private service: AirPollutionDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAirPollutionData> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<AirPollutionData>) => response.ok),
                map((airPollutionData: HttpResponse<AirPollutionData>) => airPollutionData.body)
            );
        }
        return of(new AirPollutionData());
    }
}

export const airPollutionDataRoute: Routes = [
    {
        path: '',
        component: AirPollutionDataComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'smogAnalyzerApp.airPollutionData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: AirPollutionDataDetailComponent,
        resolve: {
            airPollutionData: AirPollutionDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airPollutionData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AirPollutionDataUpdateComponent,
        resolve: {
            airPollutionData: AirPollutionDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airPollutionData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: AirPollutionDataUpdateComponent,
        resolve: {
            airPollutionData: AirPollutionDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airPollutionData.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const airPollutionDataPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: AirPollutionDataDeletePopupComponent,
        resolve: {
            airPollutionData: AirPollutionDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airPollutionData.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
