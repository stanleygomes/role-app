import { Component } from '@angular/core';
import { LoadingController, NavController, ModalController, Platform, MenuController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { GoogleAnalytics } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PlacesListPage } from '../../pages/places/list';
import { PlacesCityPage } from '../../pages/places/city';

@Component({
	templateUrl: 'home.html'
})

export class HomePage {

	categories: any;
	pl: any = PlacesListPage;
	pc: any = PlacesCityPage;
	menu: any;
	sc: any;
	userCoordLat: any;
	userCoordLon: any;
    loader: any;
    city: any = '';
    country: any;
    content: any;

	constructor(public menuCtrl: MenuController, public navCtrl: NavController, private http: Http, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public platform: Platform) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("Home Page");
		});
	}

	onViewDidEnter() {
	    this.menu.enable(true, 'content');
	}

	ngOnInit() {

		Geolocation.getCurrentPosition().then(pos => {
	        this.presentLoading();

            var coordinates = {'lat': pos.coords.latitude, 'lng': pos.coords.longitude};
            window.localStorage.setItem('coordinates', JSON.stringify(coordinates));

            this.getCity(pos.coords.latitude + ',' + pos.coords.longitude);
		}).catch((error) => {
			this.blankCity();
		});

		this.categories = [
			{id: 7, name: 'Bares e Restaurantes', subname: '', image: 'restaurant', subcategories: ['meal_delivery', 'meal_takeaway', 'restaurant', 'bakery', 'bar', 'food', 'grocery_or_supermarket']},
			{id: 1, name: 'Cafés e Livrarias', subname: '', image: 'cafes', subcategories: ['book_store', 'cafe', 'library']},
			{id: 2, name: 'Cinemas e Teatros', subname: '', image: 'cinema', subcategories: ['movie_rental', 'movie_theater']},
			{id: 8, name: 'Esportes e Saúde', subname: '', image: 'sports', subcategories: ['bowling_alley', 'spa', 'stadium', 'gym', 'bicycle_store', 'health']},
			{id: 4, name: 'História e Religião', subname: '', image: 'history', subcategories: ['synagogue', 'hindu_temple', 'church', 'place_of_worship', 'art_gallery', 'museum', ]},
			{id: 9, name: 'Lojas e Shoppings', subname: '', image: 'stores', subcategories: ['beauty_salon', 'hair_care', 'hardware_store', 'home_goods_store', 'jewelry_store', 'clothing_store', 'convenience_store', 'department_store', 'electronics_store', 'furniture_store', 'liquor_store', 'florist', 'shoe_store', 'shopping_mall', 'store', 'establishment']},
			{id: 5, name: 'Natureza', subname: '', image: 'nature', subcategories: ['zoo', 'park', 'amusement_park', 'aquarium', 'campground']},
			{id: 6, name: 'Para noite', subname: '', image: 'night', subcategories: ['night_club', 'casino']},
			{id: 3, name: 'Para os Pets', subname: '', image: 'dogs', subcategories: ['pet_store', 'veterinary_care']}
		];
	}

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Buscando localização..."
        });
        this.loader.present();
    }

    getCity(coord) {

		var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + coord;

		this.http.get(url).map(res => res.json()).subscribe(data => {
			if(data.status != "OK")
				this.blankCity();
			else{
				this.city = data.results[0].address_components[4].long_name + " - " + data.results[0].address_components[6].long_name;
			}
		});
        this.loader.dismiss();
    }

    blankCity() {
		this.city = "Selecione manualmente";
        if(this.loader)
	        this.loader.dismiss();
    }

	openModal(component, obj = {}) {
	    let modal = this.modalCtrl.create(component, obj);
		modal.onDidDismiss(data => {
			this.city = data.city;
		});
	    modal.present();
	}

	openMenu() {
		this.menuCtrl.open();
	}

    openPage(component, parameters = {}){
		this.navCtrl.push(component, parameters);
    }
}
