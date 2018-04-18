import {Component, OnInit} from '@angular/core';
import {
  AlertController, Loading, LoadingController, NavController, Platform,
  ToastController
} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {Storage} from "@ionic/storage";
import {WordpressService} from "../shared/services/wordpress.service";
import {WordpressMedia} from "../wordpress-media/wordpress-media.component";


declare var cordova: any;

@Component({
  selector: 'WordpressMedias',
  templateUrl: 'wordpress-medias.html',
  providers: [ WordpressService ]
})
export class WordpressMedias implements OnInit {


  //  Tableau des MEDIAS
  public medias: any[] = [];

  pageCount: number;

  token: any;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
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
  }



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

              if( response["deleted"]=== true ) {
                //  On retire le media du tableau
                this.medias.splice(index, 1);
                // retour Home
                this.goToMedias();
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


  goToMedias(): void {
    this.navCtrl.push(WordpressMedias);
  }

}
