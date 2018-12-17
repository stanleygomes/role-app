import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { FeedbackPage } from '../../pages/general/feedback';

@Component({
	templateUrl: 'about.html'
})

export class AboutPage {

    feedback: any = FeedbackPage;
    mailgunApiKey: string;

	constructor(public menuCtrl: MenuController, public navCtrl: NavController) {
	}

	ngOnInit() {
	}

	openMenu() {
		this.menuCtrl.open();
	}

    openPage(component, parameters = {}){
        this.navCtrl.push(component, parameters);
    }
}
