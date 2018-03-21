import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from "ionic-angular";
import {SocialSharing} from "@ionic-native/social-sharing";


import {WordpressService} from "../shared/services/wordpress.service";
import {ContactComponent} from "../../contact/contact-component/contact.component";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
  selector: "WordpressMenudujour",
  templateUrl: './wordpress-menudujour.html',
  providers: [WordpressService]
})
export class WordpressMenudujour {


  now: any;
  menudujour: any;
  authorData: any;


  constructor(
    private inAppBrowser: InAppBrowser,
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private navController: NavController,
    private loadingController: LoadingController,
    private socialSharing: SocialSharing
  ) {
    if (navParams.get('menudujour')) {
      this.menudujour = navParams.get('menudujour');
      this.authorData = this.menudujour["_embedded"].author[0];
    }
    if (navParams.get('id')) {
      this.getMenuduJour(navParams.get('id'));
    }
    this.now= Date.now();
  }

  getMenuduJour(id) {
    let loader = this.loadingController.create({
      content: "Chargement en cours ..."
    });

    loader.present();
    this.wordpressService.getMenuduJour(id)
      .subscribe(result => {
          this.menudujour = result;
          this.authorData = this.menudujour["_embedded"].author[0];
        },
        error => console.log(error),
        () => loader.dismiss());
  }


  sharePost() {
    let subject = this.menudujour.title.rendered;
    let message = this.menudujour.content.rendered;
    message = message.replace(/(<([^>]+)>)/ig,"");
    let url = this.menudujour.link;
    this.socialSharing.share(message, subject, '', url);
  }

  // FAB Btn method / CallNumberFixe -> call Fixe Number , CallNumberMobile -> call Mobile Number

  callNumberFixe(): void {
    //setTimeout option : fixe un leger temps avant l'ouverture du Téléphone += fluid
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
