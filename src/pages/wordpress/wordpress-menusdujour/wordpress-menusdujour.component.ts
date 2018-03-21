import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {WordpressService} from "../shared/services/wordpress.service";
import {WordpressMenudujour} from "../wordpress-menudujour/wordpress.menudujour.component";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ContactComponent} from "../../contact/contact-component/contact.component";
import {WordpressCreatepost} from "../wordpress-createpost/wordpress-createpost.component";


@Component({
  selector: "WordpressMenusdujour",
  templateUrl: './wordpress-menusdujour.html',
  providers: [ WordpressService ]
})

export class WordpressMenusdujour implements OnInit{


  now: any; // date du jour
  menusdujour: any; // suggestion du chef
  pageCount: number; // nbs page
  category: any; // Catégories Suggestions
  author: any; // Auteur
  search: string; // recherche
  hideSearchbar: boolean; // Cache recherche
  favoritePosts: any;
  addbutton: boolean = false;
  user: any;

  constructor(
    private inAppBrowser: InAppBrowser,
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    ) {
    // if(this.storage.get('wordpress.user')){
    //   this.addbutton = true;
    //   console.log(this.addbutton);}
  }

  ngOnInit() {
    this.now =  Date.now(); // date du jour Object
    this.category = this.navParams.get('category');
    this.author = this.navParams.get('author');
    this.hideSearchbar = true; // Flag SearchBar
    this.search = '';
    this.favoritePosts = []; // Array pour favoris
    this.storage.get('wordpress.favorite')
      .then(data => {
        if(data) {
          this.favoritePosts = JSON.parse(data);
        }
      });
    this.getMenusduJour();

    this.storage.get('wordpress.user')
      .then( value => {
        if(value) {
          this.user = value;
          console.log(this.user);
          this.addbutton = true;
        }
      });

  }


  getMenusduJour(){
    this.wordpressService.getNewsMenusduJour()
      .subscribe(result => {
              this.menusdujour = result;
            });
  }

  // getMenusduJour() {
  //   this.pageCount = 1;
  //
  //   let query = this.createQuery();
  //   let loader = this.loadingController.create({
  //     content: "Chargement en cours",
  //     duration: 10000
  //   });
  //
  //   loader.present();
  //   this.wordpressService.getMenusduJour(query)
  //     .subscribe(result => {
  //       this.menusdujour = result;
  //       loader.dismiss();
  //     });
  // }

  // getAuthorPosts(author) {
  //   this.author = author;
  //   this.getMenusduJour();
  // }
  //
  // searchPosts() {
  //   this.getMenusduJour();
  // }



  // loadMore(infiniteScroll) {
  //   this.pageCount++;
  //
  //   let query = this.createQuery();
  //   let loader = this.loadingController.create({
  //     content: "Chargement en cours"
  //   });
  //   let toast = this.toastController.create({
  //     message: "il n'y a plus d'autres suggestions ",
  //     duration: 2000
  //   });
  //
  //   loader.present();
  //   this.wordpressService.getMenusduJour(query)
  //     .subscribe(result => {
  //         infiniteScroll.complete();
  //         if(result.length < 1) {
  //           infiniteScroll.enable(false);
  //           toast.present();
  //         } else {
  //           this.menusdujour = this.menusdujour.concat(result);
  //         }
  //       },
  //       error => console.log(error),
  //       () => loader.dismiss());
  //
  // }

  loadPost(menudujour) {
    this.navController.push(WordpressMenudujour, {
      menudujour: menudujour
   });
  }

  favoritePost(menudujour) {
    let newPost:Boolean = true;
    let message:string;

    this.favoritePosts.forEach(favPost => {
      if(JSON.stringify(favPost) === JSON.stringify(menudujour)) {
        newPost = false;
      }
    });

    if(newPost) {
      this.favoritePosts.push(menudujour);
      this.storage.set('wordpress.favorite', JSON.stringify(this.favoritePosts));
      message = "Suggestion sauvegardée dans vos favoris";
    } else {
      message = "Suggestion déjà dans vos favoris";
    }
    let toast = this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  toggleSearchbar() {
    this.hideSearchbar = !this.hideSearchbar;
  }

  goToCreateSuggestion(): void {
    this.navController.push(WordpressCreatepost);
  }



  // creation de la query


  createQuery() {
    let query = {};
    query['page'] = this.pageCount;
    if(this.search) {
      query['search'] = this.search;
    }
    if(this.category) {
      query['cat_menu_du_jour'] = this.category.id;
    }
    if(this.author) {
      query['author'] = this.author;
    }
    return query;
  }


  // FAB Btn method / CallNumberFixe -> call Fixe Number , CallNumberMobile -> call Mobile Number

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

  goToContact(): void {
    this.navController.push(ContactComponent);
  }


}
