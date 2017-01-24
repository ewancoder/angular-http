import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule as AngularHttpModule } from '@angular/http';
import { AuthModule } from 'ewancoder-angular-auth';
import { LocalizationModule } from 'ewancoder-angular-localization';
import { LoggerModule } from 'ewancoder-angular-logger';
import { HttpService } from './http.service';

@NgModule({
    imports: [
        AngularHttpModule,
        AuthModule.forRoot(),
        LocalizationModule.forRoot(),
        LoggerModule.forRoot(),
    ]
})
export class HttpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HttpModule,
            providers: [ HttpService ]
        }
    }
}
