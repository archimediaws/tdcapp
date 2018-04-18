import {Component, OnInit} from '@angular/core';
import {
  AlertController, Loading, LoadingController, NavController, Platform,
  ToastController
} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Storage} from "@ionic/storage";
import {Config} from "../../../app/app.config";
import {WordpressMedias} from "../../wordpress/wordpress-medias/wordpress-medias-component";




declare var cordova: any;

@Component({
  selector: 'page-imgcapture',
  templateUrl: 'imgcapture.html',

})
export class ImgcaptureComponent implements OnInit{

  url = this.config.wordpressApiUrl + '/wp/v2/media';

  photos : any;
  base64Image : string;
  lastImage: boolean = false;
  loading: Loading;
  token: any;

  constructor(
    private config: Config,
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

    ) { }


  ngOnInit() {

    this.token = this.storage.get('wordpress.user');
    this.photos = [];
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer cette photo ? ',
      message: '',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Oui',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  takePhoto() {
    const options : CameraOptions = {
      quality: 100, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options) .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
      this.lastImage = true;

    }, (err) => {
      console.log(err);
      this.presentToast('Erreur lors de la selection de la photo.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  uploadPhoto(){
    let The_token = this.token.__zone_symbol__value.token;
    let newFileName = this.createFileName();

    this.loading = this.loadingCtrl.create({
          content: 'Uploading...',
         });
    this.loading.present();

    let trans = this.transfer.create();
    trans.upload(this.base64Image, this.url, {

      fileName: newFileName,

      headers: {
        'Authorization': `Bearer ${The_token}`,
        'Content-Disposition': "attachment;"
      },

      params: {'fileName': newFileName}

    }).then((res) => {

      this.loading.dismissAll();
      this.presentToast('La Photo est bien Uploadée !');
      this.goToMedias();
    }).catch((err)=> {

      this.loading.dismissAll();
      this.presentToast('Erreur pendant l\'upload !');
    })
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  goToMedias(): void {
    this.navCtrl.push(WordpressMedias);
  }

}
