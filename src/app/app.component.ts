import { Component, ViewChild } from '@angular/core';
import { Events, LoadingController, Platform, MenuController, Nav} from 'ionic-angular';
import { StatusBar, Splashscreen, GoogleAnalytics } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { GooglePlus } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { HomePage } from '../pages/places/home';
import { IntroPage } from '../pages/general/intro';
import { PlacesFavoritesPage } from '../pages/places/favorites';
import { PlacesDetailsPage } from '../pages/places/details';
import { FeedbackPage } from '../pages/general/feedback';
import { AboutPage } from '../pages/general/about';
import { UsersLoginPage } from '../pages/users/login';
import { UsersProfilePage } from '../pages/users/profile';

@Component({
    templateUrl: 'app.html'
})

export class MyApp {

    @ViewChild(Nav) navCtrl;

    rootPage: any = HomePage;
    loader: any;
    about: any = AboutPage;
    home: any = HomePage;
    login: any = UsersLoginPage;
    favorites: any = PlacesFavoritesPage;
    feedback: any = FeedbackPage;
    profile: any = UsersProfilePage;
    auth: any = false;
    user: any = {};

    constructor(public events: Events, platform: Platform, public menuCtrl: MenuController, public loadingCtrl: LoadingController, public storage: Storage, public af: AngularFire) {

        // this.presentLoading();

        platform.ready().then(() => {

            this.storage.get('introShownVideo').then((result) => {
                if(result){
                    this.rootPage = HomePage;
                } else {
                    this.rootPage = IntroPage;
                    this.storage.set('introShownVideo', true);
                }
                // this.loader.dismiss();
            });

            GoogleAnalytics.debugMode();

            GoogleAnalytics.startTrackerWithId('UA-89741554-2')
            .then(() => {
                // alert('deu certo')
                // console.log('Google analytics is ready now');
            })
            .catch(e => {
                // alert(e)
                // console.log('Error starting GoogleAnalytics', e)
            });

            GoogleAnalytics.enableUncaughtExceptionReporting(true).then((_success) => {
                // alert(_success)
                // console.log(_success)
            }).catch((_error) => {
                // alert(_error)
                // console.log(_error)
            });

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            // StatusBar.styleDefault();
            StatusBar.overlaysWebView(true);
            StatusBar.backgroundColorByHexString('#387ef5');

            Splashscreen.hide();

            if(Splashscreen) {
                setTimeout(()=> {
                    Splashscreen.hide();
                }, 100);
            }
        });

        this.setUser();

        this.listenToEvents();
    }

    setUser(){
        if(window.localStorage.getItem('auth')){
            this.auth = true;
            this.user = JSON.parse(window.localStorage.getItem('auth'));
        }
    }

    listenToEvents(){
        this.events.subscribe('user:logged', (user) => {
            this.setUser();
        });

        this.events.subscribe('user:register', (user) => {
            // alert(JSON.stringify(user));
            this.af.database.object('/users/' + user.userId).set(user);
            this.openRootPage(HomePage);
        });
    }

    presentLoading(){
        this.loader = this.loadingCtrl.create({
            content: "Authenticating..."
        });
        this.loader.present();
    }

    openRootPage(component, parameters = {}){
        this.menuCtrl.close();
        this.navCtrl.setRoot(component, parameters);
    }

    openPageLogin(){
        if(this.auth)
            this.openRootPage(this.profile);
        else
            this.openPage(this.login);
    }

    openPage(component, parameters = {}){
        this.menuCtrl.close();
        this.navCtrl.push(component, parameters);
    }

    GoogleLogout(){
        window.localStorage.setItem('auth', '');
        this.user = {};
        this.auth = false;
        this.openRootPage(HomePage);

        // let nav = this.navCtrl;
        // GooglePlus.logout().then(function (response) {
        //     alert(response)
        //     window.localStorage.setItem('auth', '');
        //     nav.setRoot(HomePage);
        // },function (error) {
        //     alert(error)
            // alert('Tivemos um problema para efetuar seu logout. Por favor, tente novamente.');
        // });
    }
}
