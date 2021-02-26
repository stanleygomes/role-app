import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, Platform } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { UsersLoginPage } from '../../pages/users/login';
import { PlacesDetailsPage } from '../../pages/places/details';

@Component({
	templateUrl: 'favorites.html'
})

export class PlacesFavoritesPage {

	tabs: any = 'favorites';
	search: any = false;
	user: any = {};
	error: any = false;
	login: any = UsersLoginPage;
	placeDetails: any = PlacesDetailsPage;
	favorites: FirebaseListObservable<string[]>;

	constructor(public alertCtrl: AlertController, public menuCtrl: MenuController, public navCtrl: NavController, public platform: Platform, public af: AngularFire) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("Favorite Page");
		});
	}

	ngOnInit() {
		if(window.localStorage.getItem('auth'))
			this.user = JSON.parse(window.localStorage.getItem('auth'));
		// this.user.userId = '102491179359897275446';
		if(this.user.userId){
	        this.favorites = this.af.database.list('/users/' + this.user.userId + '/favorites');

	        // this.favorites = this.af.database.list('/users/' + this.user.userId + '/favorites', { preserveSnapshot: true });
   //      	this.favorites.subscribe(snapshots => {
   //      		snapshots.forEach(snapshot => {
   //      			// snapshot.A.B
			// 	});
			// });
			this.error = false;
		}
        else{
			this.error = true;
        }
	}

	delete(id){
		let confirm = this.alertCtrl.create({
			title: 'Remover dos favoritos',
			message: 'Você deseja remover este local de seus favoritos?',
			buttons: [{
				text: 'Sim',
				handler: () => {
					// this.user.userId = '102491179359897275446';
			        this.af.database.object('/users/' + this.user.userId + '/favorites/' + id).remove();
				}
			},{
				text: 'Agora não',
				handler: () => {
					// console.log('Agree clicked');
				}
			}]
		});

		confirm.present();
	}

	switchSearch() {
		this.search = !this.search;
	}

	openMenu() {
		this.menuCtrl.open();
	}

    openPage(component, parameters = {}){
		this.navCtrl.push(component, parameters);
    }

    openRootPage(component){
		this.navCtrl.setRoot(component);
    }
}
