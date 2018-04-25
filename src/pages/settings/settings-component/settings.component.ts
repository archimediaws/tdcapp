import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import {OneSignal} from "@ionic-native/onesignal";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsComponent {

	language: string;
  track: Array<{name: string, isChecked: boolean}> = [];
  toggle: boolean = false;


	constructor(
		private storage: Storage,
    private navCtrl: NavController,
		private translate: TranslateService,
    private oneSignal: OneSignal
		){}

	ngOnInit() {
	    this.storage.get('langage')
	    .then(value => {
	        if(value) {
	        	this.language = value;
	        } else {
	        	this.language = 'fr';
	        }
	    });

        this.storage.get('notification')
        .then( value => {
          if(value) {
            this.track = value;
            this.toggle = true;
          }
          });

	}

	selectLanguage() {
		this.storage.set('langage', this.language);
        this.translate.setDefaultLang(this.language);
        this.translate.use(this.language);
	}


  setPush(track: any){


	  if(track.isChecked){
      this.oneSignal.sendTag('notification', 'true');
      this.storage.set('notification', 'true' );
      this.goToSettings();

    }
    else{
      this.oneSignal.deleteTag('notification');
      this.storage.remove('notification');
      this.goToSettings();
	    //Unsubscribe

    }


  }


  goToSettings(): void {
	  this.navCtrl.push(SettingsComponent);
  }
}


