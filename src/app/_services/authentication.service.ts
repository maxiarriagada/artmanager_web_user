import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Config } from '../config';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,public config:Config) { }
    url = this.config.url +'/user'
    login(username: string, password: string) {
        return this.http.post<any>(this.url +'/login', { username: username, password: password })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }

    logout(id) {
        // remove user from local storage to log user out
        return this.http.post<any>(this.url + '/logout', { id: id })
            .map(response => {
                return response;
            });
    }
}