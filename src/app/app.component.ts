import { Component, Input, Output, EventEmitter, OnChanges  } from '@angular/core';

import { BehaviorSubject, Observable } from "rxjs";

import '../assets/app.css';
import { LoginComponent } from '../app/login/login.component';
import { UtilCodec} from '../app/util/utilCodec';

@Component({
    moduleId: module.id.toString(),
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent { 
  
    constructor(public loginComponent:LoginComponent,private utilCodec:UtilCodec){
      
    }

    ngOnInit() {
       
    }    
   
    logout(){
        this.loginComponent.logout();
    }
}