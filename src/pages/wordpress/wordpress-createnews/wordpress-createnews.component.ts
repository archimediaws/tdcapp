import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController, ToastController, Loading} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WordpressService } from '../shared/services/wordpress.service';
import { Transfer} from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

import {Config} from "../../../app/app.config";
import {WordpressPosts} from "../wordpress-posts/wordpress-posts.component";


declare var cordova: any;

@Component({
  selector: "WordpressCreateNews",
	templateUrl: './wordpress-createnews.html',
	providers: [ WordpressService ]
})
export class WordpressCreateNews implements OnInit {

  url = this.config.wordpressApiUrl + '/wp/v2/media';
  photos: any;
  photo;
  base64Image: string;
  lastImage: boolean = false;
  photoUploaded: boolean = false;
  loading: Loading;
  content;
  title;
  price;
  photomdjurl;
  token;

  constructor(
    private config: Config,
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    private camera: Camera,
    private transfer: Transfer,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
             ) {
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
      quality: 70, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photo = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.photo);
      this.photos.reverse();
      this.lastImage = true;


    }, (err) => {
      console.log(err);
      this.presentToast('Erreur lors de la selection de l\'image.');
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

	  let trans = this.transfer.create();
	  trans.upload(this.base64Image, this.url, {

	    fileName: newFileName,

	    headers: {
        'Authorization': `Bearer ${The_token}`,
        'Content-Disposition': 'attachment;'
      },
      params: {'fileName': newFileName}

    }).then((res) => {

      let imgUrl = JSON.parse(res.response);
      this.photomdjurl = imgUrl.guid;
      this.photoUploaded = true;

      this.presentToast('La photo est enregistrée !');

    }).catch((err)=> {
      alert(JSON.stringify(err));
      this.presentToast('Erreur lors de l\'enregistrement de la photo.');
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


  addNews(){

	  this.wordpressService.postNews(this.title, this.content, this.price, this.photomdjurl, this.token).subscribe(data => {
	    console.log(data)
    });

	  this.goToPosts();
  }


  goToPosts(): void {

    this.navController.push(WordpressPosts);

  }






}
