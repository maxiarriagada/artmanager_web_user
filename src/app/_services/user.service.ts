import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Config } from '../config';


import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: HttpClient, private config:Config) { }

    headers = new HttpHeaders().set('Content-Type', 'application/json');
    url = this.config.url + '/user';
    create(user: User) {
        return this.http.post<any>(this.url+ '/create', user, { headers: this.headers })
            .map(response => {
                return response;
            });
    }

    getAll() {
        //return this.http.get<User[]>('/api/users');
        return this.http.get<any>(this.url + '/getAll', { headers: this.headers })
            .map(response => {
                return response;
            });
    }

    getAllPreventors(){
        return this.http.get<any>(this.url + '/getAllPreventors', { headers: this.headers })
            .map(response => {
                return response;
            });
    }

    getById(id: number) {
        return this.http.get(this.url +'/' + id);
    }


    update(user: User) {
        return this.http.put<any>(this.url + '/update', user, { headers: this.headers })
            .map(response => {
                return response;
            });
    }

    delete(user: User) {
        //return this.http.delete('/api/users/' + id);
        return this.http.post<any>(this.url  + '/delete', user, { headers: this.headers })
            .map(response => {
                return response;
            });
    }
}