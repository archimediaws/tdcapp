import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressService } from '../shared/services/wordpress.service';


@Component({
  selector: "WordpressCreatePost",
	templateUrl: './wordpress-createpost.html',
	providers: [ WordpressService ]
})
export class WordpressCreatepost implements OnInit {

	 masuggestion: any = "ma suggestion create";
	 content;
	 title;
	 price;
	 token;


	constructor(
		 private navParams: NavParams,
		 private wordpressService: WordpressService,
		 private navController: NavController,
		 private loadingController: LoadingController,
		 private toastController: ToastController,
		 private storage: Storage) {}


	ngOnInit() {
        this.masuggestion = "creation";
        this.token = this.storage.get('wordpress.user');

	}


  addMenudujour(){

	  this.wordpressService.postMenuduJour(this.title, this.content, this.price, this.token).subscribe(data => {
	    console.log(data)
    });

  }












}
