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



declare var cordova: any;

@Component({
  selector: 'page-imgcapture',
  templateUrl: 'imgcapture.html',

})
export class ImgcaptureComponent implements OnInit{



  photos : any;
  base64Image : string;
  lastImage: string = null;
  loading: Loading;
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
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options) .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
      this.lastImage = imageData;
      // this.sendData(imageData);
    }, (err) => {
      console.log(err);
      this.presentToast('Error while selecting image.');
    });
  }



  uploadPhoto(){
    let The_token = this.token.__zone_symbol__value.token;

    this.loading = this.loadingCtrl.create({
          content: 'Uploading...',
         });
    this.loading.present();

    let trans = this.transfer.create();
    trans.upload(this.base64Image, "https://tdc.stephaneescobar.com/wp-json/wp/v2/media", {
      headers: {
        'Authorization': `Bearer ${The_token}`,
        'Content-Disposition': "attachment; filename='maphoto.jpeg'"
      }
    }).then((res) => {
      // alert(JSON.stringify(res));
      this.loading.dismissAll();
      this.presentToast('La Photo est bien Uploadée !');
    }).catch((err)=> {
      // alert(JSON.stringify(err));
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



}
