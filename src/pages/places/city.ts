import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
	templateUrl: 'city.html'
})

export class PlacesCityPage {

	city: any;
	txtButton: any = 'BUSCAR';
	loader: any;
	mapsKey: any = 'AIzaSyA99grH5GY84k41sg2HeVh4bSfyMk1lXEk';
	data: any = {};
	showSearch: any = true;

	constructor(public navCtrl: NavController, public viewCtrl: ViewController,  private http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public params: NavParams, public storage: Storage) {
		// this.city = '';
	}

	ngOnInit() {
	}

	presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Buscando cidade..."
        });
        this.loader.present();
    }

    getCity() {

		var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.city + '&key=' + this.mapsKey;

		this.presentLoading();
		this.http.get(url).map(res => res.json()).subscribe(data => {
			if(data.status != "OK"){
				this.data = {};
				this.showAlert('Erro', 'Cidade não encontrada. Por favor, tente novamente.');
			}
			else{
				this.showSearch = false;

	            var coordinates = {'lat': data.results[0].geometry.location.lat, 'lng': data.results[0].geometry.location.lng};
	            window.localStorage.setItem('coordinates', JSON.stringify(coordinates));

	            if(data.results[0].address_components.length == 3)
					this.data.city = data.results[0].address_components[0].long_name + ' - ' + data.results[0].address_components[2].long_name;
	            if(data.results[0].address_components.length == 4)
					this.data.city = data.results[0].address_components[0].long_name + ' - ' + data.results[0].address_components[3].long_name;
				this.dismiss();
			}
		});
        this.loader.dismiss();
    }

	showAlert(e, t) {
		let alert = this.alertCtrl.create({
			title: e,
			subTitle: t,
			buttons: ['OK']
		});
		alert.present();
	}

	dismiss() {
		if(this.data.city == '' || !this.data.city)
			this.data.city = "Selecione manualmente";

		this.viewCtrl.dismiss(this.data);
	}
}
