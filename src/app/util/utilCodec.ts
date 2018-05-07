import { Injectable } from '@angular/core';

@Injectable()
export class UtilCodec{
    encodeValue(value: string): string {
        return btoa(value);
    }

    decodeValue(value: string): string {
        return atob(value);
    }
    encodeObject(value:Object){
        let encodeObj={};
        Object.keys(value).forEach(function (k) {
           // console.log(k + ' - ' + value[k]);
            encodeObj[btoa(k)] = btoa(value[k]);
        });
        return encodeObj;
    }
    decodeObject(value: Object){
        let decodeObj = {};
        Object.keys(value).forEach(function (k) {
            //console.log(k + ' - ' + value[k]);
            decodeObj[atob(k)] = atob(value[k]);
        });
        return decodeObj;
       
    }
}