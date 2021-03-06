import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressLogin } from '../wordpress-login/wordpress-login.component';
import { WordpressPosts } from '../wordpress-posts/wordpress-posts.component';
import { WordpressPages } from '../wordpress-pages/wordpress-pages.component';
import {WordpressMenusdujour} from "../wordpress-menusdujour/wordpress-menusdujour.component";
import {ImgcaptureComponent} from "../../imgcapture/imgcapture-component/imgcapture.component";
import {WordpressProduits} from "../wordpress-produits/wordpress-produits.component";
import {WordpressMedias} from "../wordpress-medias/wordpress-medias-component";
import {WordpressCategories} from "../wordpress-categories/wordpress-categories.component";

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
        { title: 'MENUS', component: WordpressPages, icon: 'document', note: 'voir & Partager' },
        { title: 'POSTS', component: WordpressPosts, icon: 'cafe', note: 'liste & Ajouter' },
        { title: 'CATEGORIES', component: WordpressCategories, icon: 'list', note: 'liste' },
        { title: 'SUGGESTIONS', component: WordpressMenusdujour, icon: 'restaurant', note: 'liste & Ajouter'},
        { title: 'PRODUCTS', component: WordpressProduits, icon: 'qr-scanner', note: 'liste & Créer QRcode'},
        { title: 'MEDIAS', component: WordpressMedias, icon: 'images', note:'voir & Supprimer' },
        { title: 'PHOTOS', component: ImgcaptureComponent, icon: 'camera', note:'Ajouter des Photos' }
	    ];
	}

	getUser() {
	    this.storage.get('wordpress.user')
	    .then(data => {
	        if(data) {
	        	this.user = data;
	        	console.log(this.user);
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
