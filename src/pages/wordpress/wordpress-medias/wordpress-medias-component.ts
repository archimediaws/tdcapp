import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, Loading, LoadingController, NavController, Platform,
  ToastController
} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Storage} from "@ionic/storage";
import {WordpressService} from "../shared/services/wordpress.service";
import {WordpressHome} from '../wordpress-home/wordpress-home.component';
import {WordpressMedia} from "../wordpress-media/wordpress-media.component";


declare var cordova: any;

@Component({
  selector: 'WordpressMedias',
  templateUrl: 'wordpress-medias.html',
  providers: [ WordpressService ]
})
export class WordpressMedias implements OnInit {


  //  Tableau des MEDIAS vide
  public medias: any[] = [];

  // medias: any;
  pageCount: number;

  // photos : any;
  // base64Image : string;
  // lastImage: string = null;
  // loading: Loading;
  token: any;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private storage: Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl : AlertController,
    private wordpressService: WordpressService,
  ) { }


  ngOnInit() {
    this.getMedias();
    this.token = this.storage.get('wordpress.user');
    // this.photos = [];
  }

  // deletePhoto(index) {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Supprimer cette photo ? ',
  //     message: '',
  //     buttons: [
  //       {
  //         text: 'Non',
  //         handler: () => {
  //           console.log('Disagree clicked');
  //         }
  //       }, {
  //         text: 'Oui',
  //         handler: () => {
  //           console.log('Agree clicked');
  //           this.photos.splice(index, 1);
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  // takePhoto() {
  //   const options : CameraOptions = {
  //     quality: 100, // picture quality
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     targetWidth: 600,
  //     targetHeight: 600,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   }
  //   this.camera.getPicture(options) .then((imageData) => {
  //     this.base64Image = "data:image/jpeg;base64," + imageData;
  //     this.photos.push(this.base64Image);
  //     this.photos.reverse();
  //     this.lastImage = imageData;
  //     // this.sendData(imageData);
  //   }, (err) => {
  //     console.log(err);
  //     this.presentToast('Error while selecting image.');
  //   });
  // }



  // uploadPhoto(){
  //   let The_token = this.token.__zone_symbol__value.token;
  //
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Uploading...',
  //   });
  //   this.loading.present();
  //
  //   let trans = this.transfer.create();
  //   trans.upload(this.base64Image, "https://tdc.stephaneescobar.com/wp-json/wp/v2/media", {
  //     headers: {
  //       'Authorization': `Bearer ${The_token}`,
  //       'Content-Disposition': "attachment; filename='maphoto.jpeg'"
  //     }
  //   }).then((res) => {
  //     // alert(JSON.stringify(res));
  //     this.loading.dismissAll();
  //     this.presentToast('La Photo est bien Uploadée !');
  //   }).catch((err)=> {
  //     // alert(JSON.stringify(err));
  //     this.loading.dismissAll();
  //     this.presentToast('Erreur pendant l\'upload !');
  //   })
  // }



  // private presentToast(text) {
  //   let toast = this.toastCtrl.create({
  //     message: text,
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }


  getMedias() {
    this.pageCount = 1;

    let loader = this.loadingCtrl.create({
      content: "Chargement en cours",
      duration: 10000
    });

    loader.present();
    this.wordpressService.getMedias()
      .subscribe(result => {
        this.medias = result;
        console.log("medias:", this.medias);
        loader.dismiss();
      });
  }

  loadMore(infiniteScroll) {
    this.pageCount++;

    let query = this.createQuery();
    let loader = this.loadingCtrl.create({
      content: "Chargement en cours"
    });
    let toast = this.toastCtrl.create({
      message: "il n'y a plus de medias ",
      duration: 2000
    });

    loader.present();
    this.wordpressService.getMoreMedias(query)
      .subscribe(result => {
          infiniteScroll.complete();
          if(result.length < 1) {
            infiniteScroll.enable(false);
            toast.present();
          } else {
            this.medias = this.medias.concat(result);
          }
        },
        error => console.log(error),
        () => loader.dismiss());

  }


// creation de la query page
  createQuery() {
    let query = {};
    query['page'] = this.pageCount;
    return query;
  }


  deleteMedia(id, index) {
    //  Alerte de confirmation
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression de ce media est définitif',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'    //  annuler
        },
        {
          text: 'Oui',
          handler: () => {    //  Si oui
            //  On supprime le Media sur WP API
            this.wordpressService.deleteMediabyId(id, this.token).subscribe(response => {

              console.log(response);

              if( response ['success'] ) {
                //  On retire le media du tableau
                this.medias.splice(index, 1);
                // retour Home
                this.goToWPHome();
              } else {
                //  Une erreur est survenue, message !!!
                let toast = this.toastCtrl.create({
                  message: response['error'],
                  duration: 2500,
                  cssClass: 'toast-danger',
                });
                toast.present();
              }
            });
          }
        }
      ]
    });

    //  On affiche l'alerte de confirmation
    alert.present();
  }


  openMedia(media) {
    this.navCtrl.push(WordpressMedia, {
      media: media
    });
  }


  goToWPHome(){
    this.navCtrl.push(WordpressHome);
  }



}
