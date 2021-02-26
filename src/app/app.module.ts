import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/places/home';
import { IntroPage } from '../pages/general/intro';
import { PlacesListPage } from '../pages/places/list';
import { PlacesFavoritesPage } from '../pages/places/favorites';
import { PlacesCityPage } from '../pages/places/city';
import { PlacesDetailsPage } from '../pages/places/details';
import { FeedbackPage } from '../pages/general/feedback';
import { AboutPage } from '../pages/general/about';
import { UsersProfilePage } from '../pages/users/profile';
import { UsersLoginPage } from '../pages/users/login';

export const firebaseConfig = {
    apiKey: 'AIzaSyA99grH5GY84k41sg2HeVh4bSfyMk1lXEk',
    authDomain: 'keru-f6ca0.firebaseapp.com',
    databaseURL: 'https://keru-f6ca0.firebaseio.com',
    storageBucket: 'keru-f6ca0.appspot.com',
    messagingSenderId: '701902945976'
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        PlacesListPage,
        PlacesFavoritesPage,
        IntroPage,
        PlacesDetailsPage,
        PlacesCityPage,
        FeedbackPage,
        AboutPage,
        UsersProfilePage,
        UsersLoginPage,
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        PlacesListPage,
        PlacesFavoritesPage,
        IntroPage,
        PlacesDetailsPage,
        PlacesCityPage,
        FeedbackPage,
        AboutPage,
        UsersProfilePage,
        UsersLoginPage,
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})

export class AppModule {}
