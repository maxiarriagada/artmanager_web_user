import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

import { MatSnackBar, MatSnackBarConfig, MatAutocompleteDefaultOptions } from '@angular/material';
import { UtilCodec } from '../util/utilCodec';
import { AppComponent } from '../app.component';
import { NgTemplateOutlet } from '@angular/common';


@Component({
    selector:'login',
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    userSession=null;

    @Output() onLogin: EventEmitter<any> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private snackBar: MatSnackBar,
        private utilCodec: UtilCodec) {

       
         }

    ngOnInit() {
        // reset login status
        //this.authenticationService.logout(this.userSession.username);

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'register';
        
        if (localStorage.getItem(this.utilCodec.encodeValue("userSession"))) {
            this.userSession = this.utilCodec.decodeObject(JSON.parse(localStorage.getItem(this.utilCodec.encodeValue("userSession"))));
        }
        if (this.userSession != null) {
            this.router.navigate(['register']);
        }
        
    }

    openSnackBar(message: string, className: string) {
        this.snackBar.open(message, "", {
            duration: 1000,
            verticalPosition: 'top',
            extraClasses: [className]
        });
    }

    getUserSession(){
        return this.userSession;
    }

    clearModel(){
        this.model={};
    }

    login() {
        this.loading = true;

        var ip = window.location.hostname;
        //console.log(ip);
        this.authenticationService.login(this.utilCodec.encodeValue(this.model.username), this.utilCodec.encodeValue(this.model.password))
            .subscribe(
                data => {
                    this.loading = false;
                    if(data!=null && data.id!=null){
                        
                        this.model.id = data.id;
                        this.model.role = data.role;
                        this.model.company = data.company;
                        this.userSession = this.model;                       
                        delete this.userSession.password;

                        localStorage.setItem(this.utilCodec.encodeValue("userSession"), JSON.stringify(this.utilCodec.encodeObject(this.userSession)));
                        
                        this.router.navigate(['register']);
                        this.clearModel();
                    }else{
                        if (data.response.message!=null){
                            this.openSnackBar(data.response.message,'snackbar-danger');
                        }
                        
                    }
                   
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    logout() {
       
        if (localStorage.getItem(this.utilCodec.encodeValue("userSession"))) {
            this.userSession = this.utilCodec.decodeObject(JSON.parse(localStorage.getItem(this.utilCodec.encodeValue("userSession"))));
            //console.log(this.userSession);
        }else{
            this.userSession=null;
        }
        if (this.userSession!=null){
           // console.log('logout....');
        this.loading = true;
        localStorage.removeItem(this.utilCodec.encodeValue("userSession"));
        this.router.navigate(['login']);
        this.authenticationService.logout(this.userSession.id)
            .subscribe(
                response => {
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
    }
}
