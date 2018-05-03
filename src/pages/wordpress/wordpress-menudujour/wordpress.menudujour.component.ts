import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {SocialSharing} from "@ionic-native/social-sharing";

import {WordpressService} from "../shared/services/wordpress.service";
import {ContactComponent} from "../../contact/contact-component/contact.component";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Storage} from "@ionic/storage";
import {WordpressMenusdujour} from '../wordpress-menusdujour/wordpress-menusdujour.component';




@Component({
  selector: "WordpressMenudujour",
  templateUrl: './wordpress-menudujour.html',
  providers: [WordpressService]
})
export class WordpressMenudujour {

  now: any;
  menudujour: any;
  token;
  user: any;
  title: any;
  content: any;
  price: any;
  photomdjurl: any;



  constructor(private inAppBrowser: InAppBrowser,
              private navParams: NavParams,
              private wordpressService: WordpressService,
              private navController: NavController,
              private loadingController: LoadingController,
              private socialSharing: SocialSharing,
              private storage: Storage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    if (navParams.get('menudujour')) {
      this.menudujour = navParams.get('menudujour');

    }
    if (navParams.get('id')) {
      this.getMenuduJour(navParams.get('id'));
    }
    this.now = Date.now();

  }

  ngOnInit() {
    this.token = this.storage.get('wordpress.user');
    this.token
      .then(value => {
        if (value) {
          this.user = value;
        }
      });
  }

  getMenuduJour(id) {
    let loader = this.loadingController.create({
      content: "Chargement en cours ..."
    });

    loader.present();
    this.wordpressService.getNewsMenuduJourbyId(id)
      .subscribe(result => {
          this.menudujour = result;

        },
        error => console.log(error),
        () => loader.dismiss());
  }



  ReactivePost(menudujour){

    let loader = this.loadingController.create({
      content: "Reactivation de la suggestion en cours..."
    });
    loader.present();

    this.title = menudujour.title.rendered;
    this.content = menudujour.content.rendered;
    console.log(this.title)
    this.price = menudujour.prix;
    this.photomdjurl = menudujour.photomdj.guid;

    this.wordpressService.deleteNewsMenuduJourbyId(menudujour.id, this.token).subscribe(response => {

      console.log(response);

      if( response["deleted"]=== true  ) {

        this.wordpressService.postMenuduJour(this.title, this.content, this.price, this.photomdjurl, this.token).subscribe(data => {
          console.log(data);
          loader.dismiss();
          this.goToMdj();
        });


      } else {

        let toast = this.toastCtrl.create({
          message: response['error'],
          duration: 2500,
          cssClass: 'toast-danger',
        });
        toast.present();
      }
    })

  }

  deletemdj(id){

    //  Alerte de confirmation
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression est définitive',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'    //  annuler
        },
        {
          text: 'Oui',
          handler: () => {    //  Si oui
            //  On supprime la suggestion sur WP API
            let loader = this.loadingController.create({
              content: "Suppression en cours ..."
            });
            loader.present();

            this.wordpressService.deleteNewsMenuduJourbyId(id, this.token).subscribe(response => {

              console.log(response);
              loader.dismiss()
              if( response["deleted"]=== true  ) {
                this.goToMdj();
              } else {

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

  goToMdj(){
    this.navController.push(WordpressMenusdujour);
  }

  sharePost() {
    let subject = this.menudujour.title.rendered;
    let message = this.menudujour.content.rendered;
    message = message.replace(/(<([^>]+)>)/ig,"");
    let url = this.menudujour.link;
    this.socialSharing.share(message, subject, '', url);
  }


  callNumberFixe(): void {
    setTimeout(() => {
      let tel = '+33468734085'; // Fixe Number
      window.open(`tel:${tel}`, '_system');
    },100);
  }

  callNumberMobile(): void {
    setTimeout(() => {
      let tel = '+33767095522'; // Mobile Number
      window.open(`tel:${tel}`, '_system');
    },10);
  }

  goToContact(): void {
    this.navController.push(ContactComponent);
  }


}
