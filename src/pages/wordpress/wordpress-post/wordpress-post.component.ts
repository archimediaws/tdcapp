import { Component } from '@angular/core';
import {NavParams, LoadingController, NavController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import {Storage} from "@ionic/storage";
import { WordpressService } from '../shared/services/wordpress.service';
import {WordpressPosts} from "../wordpress-posts/wordpress-posts.component";

@Component({
  selector:'WordpressPost',
	templateUrl: './wordpress-post.html',
	providers: [ WordpressService ]
})
export class WordpressPost {

	  post: any;
    authorData: any;
    token;
    user: any;


	constructor(
			private navParams: NavParams,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
			private iab: InAppBrowser,
			private socialSharing: SocialSharing,
      private navController: NavController,
      private storage: Storage,
		) {
		if (navParams.get('post')) {
			this.post = navParams.get('post');
			this.authorData = this.post["_embedded"].author[0];

		}
		if (navParams.get('id')) {
			this.getPost(navParams.get('id'));
		}
	}

  ngOnInit() {

    this.token = this.storage.get('wordpress.user');
    this.token
      .then( value => {
        if(value) {
          this.user = value;
        }
      });

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



  // updatePost(id){
  //   let loader = this.loadingController.create({
  //     content: "Modification en cours ..."
  //   });
  //   loader.present();
  //   this.wordpressService.updateNewsbyId(id, this.token)
  //     .subscribe(result => {
  //         // this.menudujour = result;
  //
  //         this.goToPosts()
  //       },
  //       error => console.log(error),
  //       () => loader.dismiss()
  //     );
  // }



  deleteNews(id){
    let loader = this.loadingController.create({
      content: "Suppression en cours ..."
    });
    loader.present();
    this.wordpressService.deleteNewsbyId(id, this.token)
      .subscribe(result => {
          // this.menudujour = result;

          this.goToPosts()
        },
        error => console.log(error),
        () => loader.dismiss()
      );
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

  goToPosts(){
    this.navController.push(WordpressPosts);
  }

}
