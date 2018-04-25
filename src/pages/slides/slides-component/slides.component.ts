import { Component } from '@angular/core';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsComponent } from '../../tabs/tabs-component/tabs.component';
import {OneSignal} from "@ionic-native/onesignal";
import {HomeComponent} from "../../home/home-component/home.component";

@Component({
  templateUrl: 'slides.html'
})
export class SlidesComponent {

  bgimg = "assets/img/ardoise.jpg";
  track: Array<{name: string, isChecked: boolean}> = [];
  toggle: boolean = false;

  constructor(public nav: NavController,
              private storage: Storage,
              private oneSignal: OneSignal,
              private navCtrl: NavController,
              public alertCtrl : AlertController,
              public toastCtrl: ToastController,
              ) {}

  slides = [
    {
      title: "Bienvenue sur l'Application !",
      description: "La Table de Cana : <br> ''Restaurant & Traiteur''.",
      image: "assets/img/slide1.png",
    },
    {
      title: "La Carte du Restaurant",
      description: " Vous pouvez consulter facilement les différents menus de notre Carte. ",
      image: "assets/img/slide3.png",
    },
    {
      title: " Suggestions du Chef ",
      description: "Recevez les Suggestions du Chef et réservez votre menu du jour.",
      image: "assets/img/slide4.png",
    }
  ];

  ngOnInit() {

    this.storage.get('notification')
      .then( value => {
        if(value) {
          this.track = value;
          this.toggle = true;
        }
      });

  }


  openPage() {


    if(this.toggle === false) {

      let confirm = this.alertCtrl.create({
        title: 'Souhaitez-vous recevoir les Suggestions du Chef',
        message: '',
        buttons: [
          {
            text: 'Non',
            handler: () => {

              this.oneSignal.deleteTag('notification');
              this.storage.remove('notification');
              this.presentToast('Notifications désactivées ... ');
              this.nav.setRoot(TabsComponent);
            }
          }, {
            text: 'Oui',
            handler: () => {

              this.oneSignal.sendTag('notification', 'true');
              this.storage.set('notification', 'true');
              this.presentToast('Vous êtes abonné aux Suggestions du Chef');
              this.nav.setRoot(TabsComponent);
            }
          }
        ]
      });
      confirm.present();
    }
    this.storage.set('slide', true);
    this.nav.setRoot(TabsComponent);
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }




}


