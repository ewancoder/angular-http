import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule as AngularHttpModule } from '@angular/http';
import { AuthModule } from '@ewancoder/angular-auth';
import { LocalizationModule } from '@ewancoder/angular-localization';
import { LoggerModule } from '@ewancoder/angular-logger';
import { HttpService } from './http.service';

@NgModule({
    imports: [
        AngularHttpModule,
        AuthModule,
        LocalizationModule,
        LoggerModule,
    ]
})
export class HttpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HttpModule,
            providers: [
                HttpService,
                ...AuthModule.forRoot().providers,
                ...LocalizationModule.forRoot().providers,
                ...LoggerModule.forRoot().providers
            ]
        }
    }
}
