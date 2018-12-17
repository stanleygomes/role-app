import { Component } from '@angular/core';
import { LoadingController, NavController, ViewController, Platform, MenuController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';
import { Http, Request, RequestMethod, Headers, RequestOptions } from "@angular/http";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import 'rxjs/add/operator/map';

@Component({
	templateUrl: 'feedback.html'
})

export class FeedbackPage {

	http: Http;
    mailgunUrl: string;
    mailgunApiKey: string;
    showForm: any = true;
    loader: any;
    email: any;
    message: any = '';
    messageSend: any;
    sent: any;
    itemObservable: FirebaseListObservable<any>;

	constructor(public menuCtrl: MenuController, public loadingCtrl: LoadingController, http: Http, public navCtrl: NavController, public viewCtrl: ViewController, public platform: Platform, public af: AngularFire) {
		this.platform.ready().then(() => {
			GoogleAnalytics.trackView("Feedback Page");
		});

		this.http = http;
        this.mailgunUrl = "sandboxb87ef8e60bf04d6f9a590e40c4a4b758.mailgun.org";
        this.mailgunApiKey = window.btoa("api:key-b43af7633bc5730e023a5137961ed75c");
	}

	ngOnInit() {
        if(window.localStorage.getItem('auth')){
            var email = JSON.parse(window.localStorage.getItem('auth'));
            this.email = email.email;
        }
	}

	send() {

        this.messageSend = "ROLÊ APP - FEEDBACK \n\n Email: " + this.email + " \n Mensagem: " + this.message + ' \n \n Sent via Rolê App';

        this.loader = this.loadingCtrl.create({
            content: "Enviando..."
        });
        this.loader.present();

        this.itemObservable = this.af.database.list('/feedback');
        this.itemObservable.push({
            email: this.email,
            message: this.message
        });

        var requestHeaders = new Headers({ 'Authorization' : "Basic " + this.mailgunApiKey, 'Content-Type' : 'application/x-www-form-urlencoded' });

        this.http.request(new Request({
            method: RequestMethod.Post,
            url: 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages',
            body: 'from=feedback@roleapp.xyz&to=feedback@roleapp.xyz&subject=Rolê App - Feedback&text=' + this.messageSend,
            headers: requestHeaders
        }))
        .subscribe(success => {
            this.showForm = false;
            this.sent = true;
            console.log("SUCCESS -> " + JSON.stringify(success));
            this.loader.dismiss();
            this.message = '';
        }, error => {
            this.showForm = false;
            this.sent = false;
            console.log("ERROR -> " + JSON.stringify(error));
            this.loader.dismiss();
            this.message = '';
        });
    }

    openMenu() {
        this.menuCtrl.open();
    }
}
