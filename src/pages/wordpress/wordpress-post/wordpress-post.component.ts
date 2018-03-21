import { Component } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

import { WordpressService } from '../shared/services/wordpress.service';

@Component({
  selector:'WordpressPost',
	templateUrl: './wordpress-post.html',
	providers: [ WordpressService ]
})
export class WordpressPost {
	post: any;
    authorData: any;


	constructor(
			private navParams: NavParams,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
			private iab: InAppBrowser,
			private socialSharing: SocialSharing
		) {
		if (navParams.get('post')) {
			this.post = navParams.get('post');
			this.authorData = this.post["_embedded"].author[0];

		}
		if (navParams.get('id')) {
			this.getPost(navParams.get('id'));
		}
	}

	getPost(id) {
		let loader = this.loadingController.create({
			content: "Chargement en cours ..."
		});

		loader.present();
		this.wordpressService.getPost(id)
		.subscribe(result => {
			this.post = result;
			this.authorData = this.post["_embedded"].author[0];
		},
		error => console.log(error),
    () => loader.dismiss());
	}

	previewPost() {
		const browser = this.iab.create(this.post.link, '_blank');
		browser.show();
	}

	sharePost() {
		let subject = this.post.title.rendered;
		let message = this.post.content.rendered;
		message = message.replace(/(<([^>]+)>)/ig,"");
		let url = this.post.link;
		this.socialSharing.share(message, subject, '', url);
	}

}
