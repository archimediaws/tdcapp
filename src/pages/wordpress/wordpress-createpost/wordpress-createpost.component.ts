import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController, ToastController, Loading} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressService } from '../shared/services/wordpress.service';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';

declare var cordova: any;

@Component({
  selector: "WordpressCreatePost",
	templateUrl: './wordpress-createpost.html',
	providers: [ WordpressService ]
})
export class WordpressCreatepost implements OnInit {

  photos: any;
  base64Image: string;
  lastImage: string = null;
  loading: Loading;

  content;
  title;
  price;
  photo;
  token;


  constructor(private navParams: NavParams,
              private wordpressService: WordpressService,
              private navController: NavController,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private storage: Storage,
              private camera: Camera,
              private transfer: Transfer,
              private file: File,
              private filePath: FilePath,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,) {
  }


  ngOnInit() {

    this.token = this.storage.get('wordpress.user');
    this.photos = [];
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Voulez-vous supprimer cette photo?',
      message: '',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }


  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
      // allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photo = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
      this.lastImage = imageData;
      console.log('last:', this.photo);
      // this.upload();
    }, (err) => {
      console.log(err);
      this.presentToast('Erreur lors de la selection de l\'image.');
    });
  }


  upload(){

	  let mdjdata = {

	   //  "title" : this.title,
      // "content": this.content,
      // "prix": this.price,
      "photomdj": this.photo
      // "status": "publish"
    }

    this.wordpressService.getSaveImage(mdjdata, this.token).subscribe(
      response => {
        console.log("data add sucessfully");
      },
      err => {
        console.log("err...."+err );
      }
    );



  }


  uploadPhoto(){
	  let The_token = this.token.__zone_symbol__value.token;

	  let trans = this.transfer.create();
	  trans.upload(this.photo, "https://tdc.stephaneescobar.com/wp-json/wp/v2/media", {
	    headers: {
        'Authorization': `Bearer ${The_token}`,
        'Content-Disposition': "attachment; filename=\'maphoto.jpeg\'"
      }
    }).then((res) => {
      alert(JSON.stringify(res));
    }).catch((err)=> {
      alert(JSON.stringify(err));
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



  addMenudujour(){

	  this.wordpressService.postMenuduJour(this.title, this.content, this.price, this.photo, this.token).subscribe(data => {
	    console.log(data)
    });

  }












}
