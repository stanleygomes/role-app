import { Component,ElementRef,OnInit } from '@angular/core';
import { MenuController, Events, NavController, LoadingController, Platform } from 'ionic-angular';
import { GooglePlus } from 'ionic-native';

import { HomePage } from '../../pages/places/home';

@Component({
	templateUrl: 'login.html'
})

export class UsersLoginPage {

	loader: any;
	user: any;

	constructor(public menuCtrl: MenuController, public events: Events, platform: Platform, public navCtrl: NavController, public loadingCtrl: LoadingController) {
	}

	ngOnInit() {
        if(window.localStorage.getItem('auth')){
            this.user = JSON.parse(window.localStorage.getItem('auth'));
            if(this.user.email)
            	this.openPage(HomePage);
        }
	}

	googleLogin(){

		let nav = this.navCtrl;
		let events = this.events;

	    let loading = this.loadingCtrl.create({
	      content: 'Por favor aguarde...'
	    });

	    loading.present();

		GooglePlus.login({
			'scopes': '',
			'webClientId': '716041470965-djcehk5r90ohmj1053ornf2ptq18erug.apps.googleusercontent.com',
			'offline': true
		})
		.then(function (user) {

			// alert(JSON.stringify(user))

            window.localStorage.setItem('auth', JSON.stringify(user));

            events.publish('user:logged', user);
            events.publish('user:register', user);
			loading.dismiss();

		}, function (error) {
			// var user = {userId: 777, displayName: 'fulano de tal', email: 'a@gmail.com'}
            // events.publish('user:register', user);

			alert('Houve um problema no login. Por favor, tente novamente');
			loading.dismiss();
		});
	}

	openMenu() {
		this.menuCtrl.open();
	}

    openPage(component, parameters = {}){
        this.navCtrl.setRoot(component, parameters);
    }
}