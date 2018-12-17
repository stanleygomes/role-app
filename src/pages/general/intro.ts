import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { HomePage } from '../../pages/places/home';

@Component({
	templateUrl: 'intro.html'
})

export class IntroPage {

	home: any = HomePage;
	sliderOptions: any;

	constructor(public navCtrl: NavController, public platform: Platform) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("Intro Page");
		});

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
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad IntroPage');
	}

    openPage(component, parameters = {}){
		this.navCtrl.setRoot(component, parameters);
    }
}
