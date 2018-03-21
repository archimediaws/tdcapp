import { Component } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
import { Config } from '../../../app/app.config';
import {NavController} from "ionic-angular";
import {GoogleMapsComponent} from "../../google-maps/google-maps-component/google-maps.component";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {
  email: {subject: string, body: string} = {
    subject: '',
    body: ''
  };

  constructor(
  	private config: Config,
    public navCtrl: NavController,
    private emailComposer: EmailComposer
  ) {}

  sendEmail() {
  	let email = {
  		to: this.config.emailTo,
  		cc: '',
  		bcc: '',
  		attachments: [],
  		subject: this.email.subject,
  		body: this.email.body,
  		isHtml: true
  	};
  	this.emailComposer.open(email);
  }

  goToGmaps() {
    this.navCtrl.push(GoogleMapsComponent);

  }



  // method / CallNumberFixe -> call Fixe Number , CallNumberMobile -> call Mobile Number
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


}
