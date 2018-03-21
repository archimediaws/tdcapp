import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsComponent } from '../../tabs/tabs-component/tabs.component';

@Component({
  templateUrl: 'slides.html'
})
export class SlidesComponent {

  bgimg = "assets/img/ardoise.jpg"

  constructor(public nav: NavController, private storage: Storage) {}

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

  openPage() {
    this.storage.set('slide', true);
    this.nav.setRoot(TabsComponent);
  }
}


