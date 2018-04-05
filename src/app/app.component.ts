import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Config } from './app.config';

import { TabsComponent } from '../pages/tabs/tabs-component/tabs.component';
import { SettingsComponent } from '../pages/settings/settings-component/settings.component';

import { WordpressMenus } from '../pages/wordpress/wordpress-menus/wordpress-menus.component';
import { SlidesComponent } from '../pages/slides/slides-component/slides.component';
import {AboutComponent} from "../pages/about/about-component/about.component";


import {WordpressHome} from "../pages/wordpress/wordpress-home/wordpress-home.component";
import {WordpressFavorites} from "../pages/wordpress/wordpress-favorites/wordpress-favorites.component";
import {RestaurantComponent} from "../pages/restaurant/restaurant-component/restaurant.component";
import {OneSignal} from "@ionic-native/onesignal";
import {WordpressMenusdujour} from "../pages/wordpress/wordpress-menusdujour/wordpress-menusdujour.component";
import {ImgcaptureComponent} from "../pages/imgcapture/imgcapture-component/imgcapture.component";






@Component({
	templateUrl: './app.html'

})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage = SlidesComponent;
	menuPage = WordpressMenus;
	pages: Array<{title: string, component: any, icon: string}>;
	wordpressMenusNavigation: boolean = false;


	constructor(
		private platform: Platform,
		private translate: TranslateService,
		private storage: Storage,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private config: Config,
		private menuController: MenuController,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
		) {
		this.initializeApp();

		this.translate.setDefaultLang('fr');
		storage.get('langage').then((value) => {
			if (value) {
				this.translate.use(value);
			} else {
				this.translate.use('fr');
				storage.set('langage', 'fr');
			}
		});

    this.storage.get('slide')
      .then( value => {
        if(value) {
          this.nav.setRoot(TabsComponent);
        }
      });

		this.pages = [
		  { title: 'HOME', component: TabsComponent, icon: 'home' },
      { title: 'PRESENTATION', component: RestaurantComponent, icon: 'flag'},
      { title: 'FAVORITES', component: WordpressFavorites, icon: 'heart' },
      { title: 'SETTINGS', component: SettingsComponent, icon: 'settings'},
      { title: 'SLIDE', component: SlidesComponent, icon: 'arrow-dropright-circle'},
      { title: 'ABOUT', component: AboutComponent, icon: 'information-circle'},
      { title: 'LOGIN', component: WordpressHome, icon: 'finger-print' },
      { title: 'LOGIN', component: ImgcaptureComponent, icon: 'finger-print' },
		];
		this.wordpressMenusNavigation = config.wordpressMenusNavigation;


	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			if(this.platform.is('cordova')){
        this.setupPush()
      }

		});
	}


  openPage(page) {
		this.menuController.close();
		this.nav.setRoot(page.component);
	}

	setupPush(){
    this.oneSignal.startInit('559c8e8f-f244-44c8-a51f-6fc66d516b0d', '411044932758');

    this.oneSignal.handleNotificationReceived().subscribe(data =>{
      console.log('recu un push: ', data );
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      console.log('ouvert un push: ', data );

      let message = data.notification.payload.body;
      let title = data.notification.payload.title;

      let action = data.notification.payload.additionalData['action'];
      // let actionId = data.notification.payload.additionalData['id'];

      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons : [
          {
            text: 'Fermer',
            role: 'Annuler'
           }
           ,{

            text: "Ouvrir",
            handler: () => {
              if (action === 'openPage'){
                this.menuController.close();
                this.nav.setRoot(WordpressMenusdujour);

              }
            }
          }
        ]

      })

      alert.present();

    });


    this.oneSignal.endInit();

  }


}
