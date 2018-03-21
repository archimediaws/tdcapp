import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressLogin } from '../wordpress-login/wordpress-login.component';
import { WordpressPosts } from '../wordpress-posts/wordpress-posts.component';
import { WordpressPages } from '../wordpress-pages/wordpress-pages.component';
import {WordpressMenusdujour} from "../wordpress-menusdujour/wordpress-menusdujour.component";

@Component({
  templateUrl: 'wordpress-home.html'
})
export class WordpressHome {
  bgimg = "assets/img/splashbglogin.jpg";
  logo = "assets/img/appicon.png";
	user: any;
	pages: Array<{title: string, component: any, icon: string, note: string}>;

	constructor(
		private navController: NavController,
		private navParams: NavParams,
		private storage: Storage) {
			this.user = navParams.get('user');
	}

	ngOnInit() {
		this.getUser();
	  	this.pages = [
        { title: 'POSTS', component: WordpressPosts, icon: 'cafe', note: 'voir liste' },
        { title: 'SUGGESTIONS', component: WordpressMenusdujour, icon: 'restaurant', note: 'voir liste'},
        { title: 'PAGES', component: WordpressPages, icon: 'document', note: 'voir liste' },
	    ];
	}

	getUser() {
	    this.storage.get('wordpress.user')
	    .then(data => {
	        if(data) {
	        	this.user = data;
	        }
	    });
	}

	login() {
		this.navController.push(WordpressLogin);
	}

	logout() {
		this.user = undefined;
		this.storage.remove('wordpress.user');
	}

	openPage(page) {
		this.navController.push(page.component);
	}
}
