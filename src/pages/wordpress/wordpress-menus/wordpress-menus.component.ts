import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { WordpressService } from '../shared/services/wordpress.service';
import { WordpressMenu } from '../wordpress-menu/wordpress-menu.component';

@Component({
	templateUrl: './wordpress-menus.html',
	providers: [ WordpressService ]
})
export class WordpressMenus {

	menus: any;

	constructor(
		private wordpressService: WordpressService,
		private navController: NavController,
		private loadingController: LoadingController,
		) {}

	ngOnInit() {
		this.getMenus();
	}

	getMenus() {
		let loader = this.loadingController.create({
			content: "Chargement en cours..."
		});

		loader.present();
		this.wordpressService.getMenus()
		.subscribe(result => {
			this.menus = result;
			loader.dismiss();
		});
	}

	loadMenu(menu) {
		this.navController.push(WordpressMenu, {
			title: menu.name,
			id: menu.ID
		});
	}

}
