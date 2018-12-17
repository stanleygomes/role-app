import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { UsersLoginPage } from '../../pages/users/login';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
	templateUrl: 'profile.html'
})

export class UsersProfilePage {

	user: any = {};
	error: any = true;
	login: any = UsersLoginPage;

	constructor(public menuCtrl: MenuController, public navCtrl: NavController, private http: Http) {
	}

	ngOnInit(){

        if(window.localStorage.getItem('auth')){
			this.error = false;
            this.user = JSON.parse(window.localStorage.getItem('auth'));
        }
        else
			this.error = true;
	}

    openPage(component){
		this.navCtrl.push(component);
    }

    openMenu() {
        this.menuCtrl.open();
    }
}
