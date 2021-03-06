import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AuthService } from '@ewancoder/angular-auth';
import { LocaleService } from '@ewancoder/angular-localization';
import { LoggerService } from '@ewancoder/angular-logger';

@Injectable()
export class HttpService {
    private readonly tags: string[] = ['http', 'service'];
    private readonly headers: Headers;

    private readonly getColor: string = '#07c';
    private readonly postColor: string = '#0a0';
    private readonly putColor: string = '#aa0';
    private readonly deleteColor: string = '#a00';

    constructor(
        private readonly unauthorizedRedirectUri: string,
        private readonly http: Http,
        private readonly logger: LoggerService,
        private readonly router: Router,
        auth: AuthService,
        locale: LocaleService) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');

        auth.token$.subscribe(res => this.headers.set('Authorization', 'Bearer ' + res));
        locale.language$.subscribe(res => this.headers.set('Language', res));

        this.logger.log('Initialized HttpService.', [...this.tags, 'init']);
    }

    popUnauthorizedUri() : string | undefined {
        let uri = localStorage.getItem('ewancoder-angular-http-unauthorizedUri');
        if (uri) {
            localStorage.removeItem('ewancoder-angular-http-unauthorizedUri');
            return uri;
        } else {
            return undefined;
        }
    }

    get(uri: string, search?: string|URLSearchParams|{[key: string]: any | any[]}|null): Observable<any> {
        this.logger.log(`GET ${uri}`, [...this.tags, 'get', 'req'], this.getColor);

        return this.http.get(uri, { headers: this.headers, search: search })
            .do(_ => {}, (err: Response) => this.handleResponse(err))
            .map(this.map)
            .do(res => {
                this.logger.log(`Successful GET ${uri}`, [...this.tags, 'get', 'res'], this.getColor);
            }, err => {
                this.logger.log(`Failed GET ${uri}`, [...this.tags, 'get', 'res'], this.getColor);
            });
    }

    post(uri: string, data: any): Observable<any> {
        this.logger.log(`POST ${uri}`, [...this.tags, 'post', 'req'], this.postColor);

        return this.http.post(uri, data, { headers: this.headers })
            .do(_ => {}, (err: Response) => this.handleResponse(err))
            .map(this.map)
            .do(res => {
                this.logger.log(`Successful POST ${uri}`, [...this.tags, 'post', 'res'], this.postColor);
            }, err => {
                this.logger.log(`Failed POST ${uri}`, [...this.tags, 'post', 'res'], this.postColor);
            });
    }

    put(uri: string, data: any): Observable<any> {
        this.logger.log(`PUT ${uri}`, [...this.tags, 'put', 'req'], this.putColor);

        return this.http.put(uri, data, { headers: this.headers })
            .do(_ => {}, (err: Response) => this.handleResponse(err))
            .map(this.map)
            .do(res => {
                this.logger.log(`Successful PUT ${uri}`, [...this.tags, 'put', 'res'], this.putColor);
            }, err => {
                this.logger.log(`Failed PUT ${uri}`, [...this.tags, 'put', 'res'], this.putColor);
            });
    }

    delete(uri: string): Observable<any> {
        this.logger.log(`DELETE ${uri}`, [...this.tags, 'delete', 'req'], this.deleteColor);

        return this.http.delete(uri, { headers: this.headers })
            .do(_ => {}, (err: Response) => this.handleResponse(err))
            .map(this.map)
            .do(res => {
                this.logger.log(`Successful DELETE ${uri}`, [...this.tags, 'delete', 'res'], this.deleteColor);
            }, err => {
                this.logger.log(`Failed DELETE ${uri}`, [...this.tags, 'delete', 'res'], this.deleteColor);
            });
    }

    private map(res: any) {
        let json: any;

        try {
            json = res.json();
        } catch (e) {
            json = undefined;
        }

        if (json) {
            return json;
        } else {
            return res.text();
        }
    }

    private handleResponse(res: Response) {
        if (res.status === 401 && this.unauthorizedRedirectUri) {
            localStorage.setItem('ewancoder-angular-http-unauthorizedUri', this.router.url);
            
            this.logger.log("Unauthorized. Redirecting to URL " + this.unauthorizedRedirectUri);
            this.router.navigate([this.unauthorizedRedirectUri]);
        }
    }
}
