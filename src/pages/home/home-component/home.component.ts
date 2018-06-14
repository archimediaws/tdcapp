import { Component } from '@angular/core';
import {NavController, Events, MenuController} from 'ionic-angular';

import { WordpressPage } from '../../wordpress/wordpress-page/wordpress-page.component';
import {SettingsComponent} from "../../settings/settings-component/settings.component";







@Component({
	selector: 'page-home',
	templateUrl: 'home.html'

})
export class HomeComponent {


	pages: Array<{title: string, component: any, img?: string, icon: string, note: string, params?: any}>;
	constructor(
		private navController: NavController,
		private menuController: MenuController,
		private events: Events) {}

	ngOnInit() {
	  	this.pages = [

        { title: 'MENUCANA', component: WordpressPage, img: 'assets/img/menu-cana.png',icon: 'bowtie', note: 'menu gastronomique', params: { id: 993, "?featured_media":[0] }},
        { title: 'SURLEPOUCE', component: WordpressPage, img: 'assets/img/surlepouce.png', icon: 'nutrition', note: 'Pressé ?', params: { id: 20 }},
        { title: 'FORMULES', component: WordpressPage, img: 'assets/img/formules.png', icon: 'ice-cream', note: 'Entrée, Plat, Dessert.. au choix', params: { id: 994 }},
        { title: 'VINS', component: WordpressPage, img: 'assets/img/vins-daqui.jpg', icon: 'wine', note: 'Vins de qualité supérieure', params: { id: 44 }},
        { title: 'VINSAUTRE', component: WordpressPage, img: 'assets/img/vins.png', icon: 'wine', note: 'Vins Rouges, Vins Blancs ...', params: { id: 475 }},
        { title: 'BOISSONS', component: WordpressPage, img: 'assets/img/boissons.png', icon: 'beer', note: 'Apéritifs, Digestifs, Cafés ...', params: { id: 995 }},

	    ];

        this.events.subscribe('navigationEvent',(object) => {
	    	this.menuController.close();
				if (object.component) {
					this.navController.push(object.component, object.params);
				}
		});


	}

	openPage(page) {
		this.navController.push(page.component, page.params);
	}

	goToSettings(){
    this.navController.push(SettingsComponent);
  }

}
