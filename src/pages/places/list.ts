import { Injectable, Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from 'ionic-native';

declare var google;

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { PlacesDetailsPage } from '../../pages/places/details';

@Component({
	templateUrl: 'list.html'
})

@Injectable()
export class PlacesListPage {

	param: any = {};
	mapsKey: any = 'AIzaSyA99grH5GY84k41sg2HeVh4bSfyMk1lXEk';
	loader: any;
	url: any;
	urlAppend: any;
	places: any = [];
	coord: any;
	details: any = PlacesDetailsPage;
	error: any;

	@ViewChild('map') mapElement: ElementRef;
	map: any;

	constructor(public navCtrl: NavController, private http: Http, public params: NavParams, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public storage: Storage, public platform: Platform) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("List Page");
		});

        var coordinates = JSON.parse(localStorage.getItem('coordinates'));
        this.coord = {
        	lat : coordinates.lat,
        	lng : coordinates.lng,
        };

		this.param.openNow = params.get("openNow");
		this.param.star = params.get("star");
		this.param.keyword = params.get("keyword");
		this.param.types = params.get("types");
		this.param.typesText = '';

		for(var i = 0; i < this.param.types.length; i++) {
			this.param.typesText += this.param.types[i];
			if(i != this.param.types.length - 1)
				this.param.typesText += '|';
		}
	}

	ngOnInit() {
	}

	ionViewDidEnter() {
		this.getPlaces();
	}

	getPlaces(){

		this.presentLoading();

		let latLng = new google.maps.LatLng(this.coord.lat, this.coord.lng);

		let mapOptions = {
			center: latLng,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		}

		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		this.url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.coord.lat + ',' + this.coord.lng + '&radius=1000&types=' + this.param.typesText + '&sensor=false&key=' + this.mapsKey;
		// this.url = 'assets/places.json';

		this.http.get(this.url).map(res => res.json()).subscribe(data => {
			// console.log(data)
			if(data.status != "OK"){
				alert("Tivemos um problema. Por favor, tente novamente. Obrigado.")
				this.error = true;
			}
			else{
				this.places = data.results;
				// if(!data)
				// 	alert("123")

				for (var i = 0; i < data.results.length; i++) {
					var place = data.results[i];

					var loc = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);

					let marker = new google.maps.Marker({
						map: this.map,
						animation: google.maps.Animation.DROP,
						position: loc
					});

					let content = '<h4>' + place.name + '</h4>' +
					'Endereço: ' + place.vicinity + '<br/>' +
					((place.opening_hours ? place.opening_hours.open_now : '') == true ? 'Aberto' : 'Fechado') + ' agora';

					let infoWindow = new google.maps.InfoWindow({
						content: content
					});
		
					google.maps.event.addListener(marker, 'click', () => {
						infoWindow.open(this.map, marker);
					});
				}
		        this.loader.dismiss();
			}
		}, err => function() {
			console.log('5666')
	        this.loader.dismiss();
		}, () => function() {
	        this.loader.dismiss();
			console.log('123')
		});

	}

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Buscando locais..."
        });
        this.loader.present();
    }

	openModal(component) {
	    let modal = this.modalCtrl.create(component);
	    modal.present();
	}

    openPage(component, parameters = {}){
		this.navCtrl.push(component, parameters);
    }
}
