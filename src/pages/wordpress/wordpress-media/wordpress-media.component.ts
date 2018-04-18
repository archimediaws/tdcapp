import { Component } from '@angular/core';
import {NavParams, LoadingController, NavController, AlertController, ToastController} from 'ionic-angular';

import {Storage} from "@ionic/storage";
import { WordpressService } from '../shared/services/wordpress.service';
import {WordpressHome} from "../wordpress-home/wordpress-home.component";

@Component({
  selector:'WordpressMedia',
	templateUrl: './wordpress-media.html',
	providers: [ WordpressService ]
})
export class WordpressMedia {
	media: any;
  token;

	constructor(
			private navParams: NavParams,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
      private storage: Storage,
      private navCtrl: NavController,
      public alertCtrl : AlertController,
      public toastCtrl: ToastController



		) {
		if (navParams.get('media')) {
			this.media = navParams.get('media');


		}
		if (navParams.get('id')) {
			this.getMedia(navParams.get('id'));
		}
	}

  ngOnInit() {
    this.token = this.storage.get('wordpress.user');
  }

	getMedia(id) {
		let loader = this.loadingController.create({
			content: "Chargement en cours ..."
		});

		loader.present();
		this.wordpressService.getMedia(id)
		.subscribe(result => {
			this.media = result;
			console.log(this.media);

		},
		error => console.log(error),
    () => loader.dismiss());
	}

  deleteMedia(id) {
    //  Alerte de confirmation
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression de ce media est définitif',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'    //  annuler
        },
        {
          text: 'Oui',
          handler: () => {    //  Si oui
            //  On supprime le Media sur WP API
            this.wordpressService.deleteMediabyId(id, this.token).subscribe(response => {

              console.log(response);

              if( response ['success'] ) {
                // retour Home
                this.goToWPHome();
              } else {
                //  Une erreur est survenue, message !!!
                let toast = this.toastCtrl.create({
                  message: response['error'],
                  duration: 2500,
                  cssClass: 'toast-danger',
                });
                toast.present();
              }
            });
          }
        }
      ]
    });

    //  On affiche l'alerte de confirmation
    alert.present();
  }

  goToWPHome(){
    this.navCtrl.push(WordpressHome);
  }

}
