import { Injectable, Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';
import { SocialSharing } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { UsersLoginPage } from '../../pages/users/login';

declare var google;

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
	templateUrl: 'details.html'
})

@Injectable()
export class PlacesDetailsPage {

	param: any = {};
	mapsKey: any = 'AIzaSyA99grH5GY84k41sg2HeVh4bSfyMk1lXEk';
	loader: any;
	url: any;
	place: any;
	coord: any;
	sliderOptions: any;
	user: any = {};
	isFavorite: any = false;
	favoritePlace: FirebaseObjectObservable<any>;

	@ViewChild('map') mapElement: ElementRef;
	map: any;

	// constructor(public alertCtrl: AlertController, public navCtrl: NavController, private http: Http, public params: NavParams, public loadingCtrl: LoadingController, public platform: Platform) {
	constructor(public alertCtrl: AlertController, public navCtrl: NavController, private http: Http, public params: NavParams, public loadingCtrl: LoadingController, public platform: Platform, public af: AngularFire) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("Details page");
		});

        var coordinates = JSON.parse(localStorage.getItem('coordinates'));
        this.coord = {
        	lat : coordinates.lat,
        	lng : coordinates.lng,
        };

		this.param.place_id = params.get("place_id");

		this.sliderOptions = {
			pager: true,
			pagination: '.swiper-pagination',
		    slidesPerView: 1,
		    paginationClickable: true,
		    paginationBulletRender: function(index, className) {
				return '<span class="' + className + '">' + this.category[index+1] + '</span>';
		    }
		};
	}

	ngOnInit() {
        if(window.localStorage.getItem('auth'))
            this.user = JSON.parse(window.localStorage.getItem('auth'));
	}

	ionViewDidLoad() {
		this.presentLoading();

		this.url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + this.param.place_id + '&key=' + this.mapsKey;
		// this.url = 'assets/details.json';

		this.http.get(this.url).map(res => res.json()).subscribe(data => {
			if(data.status != "OK"){
				alert("Tivemos um problema. Por favor, tente novamente. Obrigado.")
			}
			else{
				this.place = data.result;

				// this.user.userId = '102491179359897275446';
				if(this.user.userId){
			        this.favoritePlace = this.af.database.object('/users/' + this.user.userId + '/favorites/' + this.place.place_id, { preserveSnapshot: true });

		        	this.favoritePlace.subscribe(snapshots => {
		        		snapshots.forEach(snapshot => {
		        			if(snapshot.A.B != '')
						        this.isFavorite = true;
						});
					});
				}

				this.place.directions = 'google.com.br/maps/dir//' + this.place.geometry.location.lat + "," + this.place.geometry.location.lng;
				if(this.place.rating)
					this.place.ratingRound = Math.floor(this.place.rating);

				let latLng = new google.maps.LatLng(this.place.geometry.location.lat, this.place.geometry.location.lng);

				let mapOptions = {
					center: latLng,
					zoom: 14,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				    draggable: false,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true
				}

				this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

				var loc = new google.maps.LatLng(this.place.geometry.location.lat, this.place.geometry.location.lng);

				let marker = new google.maps.Marker({
					map: this.map,
					animation: google.maps.Animation.DROP,
					position: loc
				});
			}
		});

        this.loader.dismiss();
	}

	openWindow(url) {
		window.open(url);
	}

	favorite(place){
		// this.user.userId = '102491179359897275446';
		if(this.user.userId){
	        this.favoritePlace = this.af.database.object('/users/' + this.user.userId + '/favorites/' + place.place_id);

			if(this.isFavorite == true){
		        this.favoritePlace.remove();
		        this.isFavorite = false;
			}
			else{
				var picture;
				if(place.photos)
					if(place.photos.lenght > 0)
						picture = place.photos[0].photo_reference;
					else
						picture = '';
				else
					picture = '';

		        this.favoritePlace.set({
		        	name: place.name,
		        	picture: picture,
		        	id: place.place_id,
		        	phone: place.formatted_phone_number
		        });
		        this.isFavorite = true;
			}
		}
		else{
			let confirm = this.alertCtrl.create({
				title: 'Efetue o login',
				message: 'Você precisa estar logado para salvar este local como favorito. Deseja efetuar login agora?',
				buttons: [{
					text: 'Sim',
					handler: () => {
						this.openPage(UsersLoginPage);
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
	}

	share(url) {
		SocialSharing.share('', '', '', url).then(() => {
		}).catch(() => {
		});
	}

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Carregando dados do local..."
        });
        this.loader.present();
    }

    openPage(component, parameters = {}){
		this.navCtrl.push(component, parameters);
    }
}
