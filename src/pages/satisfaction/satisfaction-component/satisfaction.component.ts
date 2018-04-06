import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-satisfaction',
  templateUrl: 'satisfaction.html'
})
export class SatisfactionComponent {

  urlformsatisfaction : string = "https://goo.gl/forms/1Yy6AoGTqZOnXSpC3";

  constructor(public navCtrl: NavController, private iab: InAppBrowser) {

  }


  gotoSatisfactionform(){

    const browser = this.iab.create(this.urlformsatisfaction, '_blank');
    browser.show();

  }

}
