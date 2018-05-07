import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule, MatTableDataSource } from '@angular/material';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { AlertService, UserService } from '../_services/index';
import { User } from '../_models';

import { UtilCodec } from '../util/utilCodec';
import { UtilDialogComponent } from '../util/util-dialog/util-dialog.component';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'register.component.html',
    styleUrls: ['table.css']
})

export class RegisterComponent {

    userSession = null;
    sessionId;
    model: any = {};
    f: FormControl;
    loading = false;
    roles = [{ name: 'Preventor', value: 'preventor' }, { name: 'Admin', value: 'admin' }];
    //preventors = [];

    displayedColumns = ['options','col_username', 'col_preventorname'];//, 'col_role'
    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        public snackBar: MatSnackBar, private route: ActivatedRoute,
        private utilCodec: UtilCodec,
        public dialog: MatDialog) {

        this.getAllPreventors();
    }


   
    getAllPreventors(){
          this.userService.getAllPreventors().subscribe(response => {
            this.dataSource.data = response;

        }, error => {

        });
    }

    ngOnInit() {
        if (localStorage.getItem(this.utilCodec.encodeValue("userSession"))) {
            this.userSession = this.utilCodec.decodeObject(JSON.parse(localStorage.getItem(this.utilCodec.encodeValue("userSession"))));

        }
        if (this.userSession == null) {
            this.router.navigate(['login']);
        }

    }



    openSnackBar(message: string, className: string) {
        this.snackBar.open(message, "", {
            duration: 1000,
            verticalPosition: 'top',
            extraClasses: [className]
        });
    }

    setRole(role) {
        //console.log(role);
    }

    resetModel() {
        //console.log('cancel');
        this.model = { username: "", password: "", confirmpassword: "", preventorname: "" };
    }

    usernameTrim(event) {
        if (this.model.username != undefined) {
            this.model.username = this.model.username.trim();
        }
    }
    preventornameTrim() {
        if (this.model.preventorname != undefined) {
            this.model.preventorname = this.model.preventorname.trim();
        }
    }
    passwordTrim() {
        if (this.model.password != undefined) {
            this.model.password = this.model.password.trim();
        }
    }

    applyFilter(filterValue: string) {
        this.loading = true;
        //console.log(filterValue);
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        this.loading = false;
    }


    selectUser(user) {
       // console.log(user);
        user.password = "";
        this.model = user;
    }



  
    
    openSaveDialog(): void {
        //message, title, btnConfirmLbl, btnCancelLbl
        let dialogRef = this.dialog.open(UtilDialogComponent, {
            width: '250px',
            data: { title: 'Guardar?', message: '', btnConfirm: 'Guardar', btnCancel: 'Cancelar'}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result==true){
               this.saveUser();
            }
        });
    }

    openDeleteDialog(item): void {
        //message, title, btnConfirmLbl, btnCancelLbl
        let dialogRef = this.dialog.open(UtilDialogComponent, {
            width: '250px',
            data: { title: 'Eliminar?', message: '', btnConfirm: 'Eliminar', btnCancel: 'Cancelar' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.deleteMember(item);
            }
        });
    }

    deleteMember(item) {
        
        this.userService.delete(item).subscribe(response => {
            // console.log(response);
            if (response != null && response.id) {
                this.resetModel();
                this.openSnackBar('Eliminado', 'snackbar-success');
                this.userService.getAllPreventors().subscribe(response => {
                    this.dataSource.data = response;
                }, error => {

                });
            } else {
                this.openSnackBar(response.response.message, 'snackbar-danger');
            }
            this.loading = false;
        },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    saveUser() {
        if (this.model.username != null && this.model.username != "") {
            this.model.username = this.model.username.toLowerCase();
        }
        if (this.model.preventorname != null && this.model.preventorname != "") {
            this.model.preventorname = this.model.preventorname.toLowerCase();
        }
        if (this.model.password == this.model.confirmpassword) {
            if (this.model.id != null) {
                this.update();
            } else {
                this.create();
            }
        } else {
           // console.log('2');
            this.openSnackBar('No coinciden las contraseñas', 'snackbar-danger');
        }
    }


    update() {
        this.userService.update(this.model).subscribe(response => {
           // console.log(response);
            if (response != null && response.id) {
                this.resetModel();
                this.openSnackBar('Guardo', 'snackbar-success');
            } else {
                if (response.response!=null && response.response.message!=null){
                    this.openSnackBar(response.response.message, 'snackbar-danger');
                }
                
            }
            this.userService.getAllPreventors().subscribe(response => {
                this.dataSource.data = response;
            }, error => {

            });
            this.loading = false;
        },
            error => {
               // this.alertService.error(error);
                this.loading = false;
            });
    }

    create() {
        this.model.company = this.userSession.company;
        //console.log(this.model);
        this.model.role = "preventor";
        this.loading = true;
        this.userService.create(this.model).subscribe(response => {
           // console.log(response);
            if (response != null && response.id) {
                this.resetModel();
                this.openSnackBar('Guardo', 'snackbar-success');
                this.userService.getAllPreventors().subscribe(response => {
                    this.dataSource.data = response;
                }, error => {

                });
            } else {
                if (response.response.message!=null){
                    this.openSnackBar(response.response.message, 'snackbar-danger');
                }
               
            }
            this.loading = false;
        },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

    }

}