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
import {BarcodeScannerComponent} from "../pages/barcode-scanner/barcode-scanner-component/barcode-scanner.component";
import {SatisfactionComponent} from "../pages/satisfaction/satisfaction-component/satisfaction.component";
import {WordpressPosts} from "../pages/wordpress/wordpress-posts/wordpress-posts.component";
import {ContactComponent} from "../pages/contact/contact-component/contact.component";





@Component({
	templateUrl: './app.html',


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
		  { title: 'PRESENTATION', component: TabsComponent, icon: 'home' },
      { title: 'VALEURS', component: RestaurantComponent, icon: 'flag'},
      { title: 'SUGGESTIONS', component: WordpressMenusdujour, icon: 'restaurant' },
      { title: 'POSTS', component: WordpressPosts, icon: 'cafe' },
      { title: 'FAVORITES', component: WordpressFavorites, icon: 'heart' },
      { title: 'SATISFACTION', component: SatisfactionComponent, icon: 'thumbs-up'},
      { title: 'SLIDE', component: SlidesComponent, icon: 'arrow-dropright-circle'},
      { title: 'BARCODE-SCANNER', component: BarcodeScannerComponent, icon: 'qr-scanner' },
      { title: 'ABOUT', component: AboutComponent, icon: 'information-circle'},
      { title: 'CONTACT', component: ContactComponent, icon: 'contacts'},
      { title: 'SETTINGS', component: SettingsComponent, icon: 'options'},
      { title: 'LOGIN', component: WordpressHome, icon: 'finger-print' }

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
      // console.log('recu un push: ', data );
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // console.log('ouvert un push: ', data );

      let payload = data;
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
                // this.redirectToPage(payload);

              }
            }
          }
        ]

      })

      alert.present();

    });


    this.oneSignal.endInit();


  }

  // redirectToPage(data) {
  //   let type;
  //   try {
  //     type = data.notification.payload.additionalData.type;
  //   } catch (e) {
  //     console.warn(e);
  //   }
  //   switch (type) {
  //     case 'mdj': {
  //       this.nav.setRoot(WordpressPosts, { userId: data.notification.payload.additionalData.uid });
  //       break;
  //     } case 'news': {
  //     this.nav.setRoot(WordpressMenusdujour, { id: data.notification.payload.additionalData.pid });
  //     break;
  //   }
  //   }
  // }
}
