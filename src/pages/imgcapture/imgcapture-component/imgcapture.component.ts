import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController,
  AlertController, Loading, LoadingController, NavController, Platform,
  ToastController
} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import {Camera, CameraOptions} from '@ionic-native/camera';
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
  lastImage2: string = null;


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
    public actionSheetCtrl: ActionSheetController

    ) { }


  ngOnInit() {

    this.token = this.storage.get('wordpress.user');
    this.photos = [];
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer la photo ? ',
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selectionner une photo',
      buttons: [
        {
          text: 'Choisir une Photo du Téléphone',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Prendre une Photo',
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.CAMERA);
            this.takePhoto();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture() {
    // options pour PHOTOLIBRARY
    const options = {
      quality: 70,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      targetHeight: 600,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data
    this.camera.getPicture(options).then((imagePath) => {

      console.log(imagePath);
      // Special handling for Android library
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Erreur lors de la selection de la photo..');
    });
  }

  takePhoto() {
    // Options pour CAMERA
    const options : CameraOptions = {
      quality: 70,
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

  // Génére un nouveau nom pour chaque image / timestamp
  private createFileName() {
    let d = new Date(),
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
      this.presentToast('La Photo est bien uploadée !');
      this.goToMedias();
    }).catch((err)=> {

      this.loading.dismissAll();
      this.presentToast('Erreur pendant l\'upload !');
    })
  }


  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage2 = newFileName;
    }, error => {
      this.presentToast('Erreur pendant l\'enregistrement de l\'image.');
    });
  }



  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Get the accurate path to your apps folder
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage() {

    let The_token = this.token.__zone_symbol__value.token;

    // File for Upload
    let targetPath = this.pathForImage(this.lastImage2);

    let filename = this.lastImage2;

    let options = {

      headers: {
            'Authorization': `Bearer ${The_token}`,
            'Content-Disposition': "attachment;"
          },
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };


    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, this.url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('La Photo est bien uploadée !');
      this.goToMedias();
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Erreur pendant l\'upload !');
    });
  }




  goToMedias(): void {
    this.navCtrl.push(WordpressMedias);
  }

}
