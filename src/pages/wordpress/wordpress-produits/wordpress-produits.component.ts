import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {WordpressService} from "../shared/services/wordpress.service";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";




@Component({
  selector: "WordpressProduits",
  templateUrl: './wordpress-produits.html',
  providers: [ WordpressService ]
})

export class WordpressProduits implements OnInit{



  produits: any; // produits
  pageCount: number; // nbs page
  category: any; // Catégories produits
  addbutton: boolean = false;
  user: any;

  // encodeData : string ;
  encodedData : {} ;

  constructor(
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
    ) {}

  ngOnInit() {

    this.getAllProduits();
    this.storage.get('wordpress.user')
      .then( value => {
        if(value) {
          this.user = value;
          this.addbutton = true;
        }
      });

  }


  getAllProduits(){

      this.pageCount = 1;

      let loader = this.loadingController.create({
        content: "Chargement en cours",
        duration: 10000
      });

      loader.present();

    this.wordpressService.getAllPodProduits()
      .subscribe(result => {
              this.produits = result;
        loader.dismiss();
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



  loadMore(infiniteScroll) {
    this.pageCount++;

    let query = this.createQuery();
    let loader = this.loadingController.create({
      content: "Chargement en cours"
    });
    let toast = this.toastController.create({
      message: "il n'y a plus d'autres produits ",
      duration: 2000
    });

    loader.present();
    this.wordpressService.getMorePodProduits(query)
      .subscribe(result => {
          infiniteScroll.complete();
          if(result.length < 1) {
            infiniteScroll.enable(false);
            toast.present();
          } else {
            this.produits = this.produits.concat(result);
          }
        },
        error => console.log(error),
        () => loader.dismiss());

  }

  // loadPost(menudujour) {
  //   this.navController.push(WordpressMenudujour, {
  //     menudujour: menudujour
  //  });
  // }

  encodeText(plu){
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,plu).then((encodedData) => {

      console.log(encodedData);
      this.encodedData = encodedData;

    }, (err) => {
      console.log("Error : " + err);
    });
  }



  // creation de la query page

  createQuery() {
    let query = {};
    query['page'] = this.pageCount;

    return query;
  }




}
