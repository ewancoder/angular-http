import { FactoryProvider } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '@ewancoder/angular-auth';
import { LocaleService } from '@ewancoder/angular-localization';
import { LoggerService } from '@ewancoder/angular-logger';
import { HttpService } from './http.service';

let httpServiceFactory = (http: Http, logger: LoggerService, router: Router, auth: AuthService, locale: LocaleService) => {
    return new HttpService(undefined, http, logger, router, auth, locale);
}

export let httpServiceProvider: FactoryProvider = {
    provide: HttpService,
    useFactory: httpServiceFactory,
    deps: [ Http, LoggerService, Router, AuthService, LocaleService ]
};

export class HttpServiceFactory {
    static withUnauthorizedRedirectUri(unauthorizedRedirectUri: string): FactoryProvider {
        return {
            provide: LocaleService,
            useFactory: (http: Http, logger: LoggerService, router: Router, auth: AuthService, locale: LocaleService) => {
                return new HttpService(undefined, http, logger, router, auth, locale);
            },
            deps: [ Http, LoggerService, Router, AuthService, LocaleService ]
        }
    }
}
