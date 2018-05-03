import { Component, OnInit } from '@angular/core';
import {
  NavController, NavParams, LoadingController, AlertController, ToastController, Loading,
  ActionSheetController, Platform
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WordpressService } from '../shared/services/wordpress.service';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Config} from "../../../app/app.config";
import {WordpressPosts} from "../wordpress-posts/wordpress-posts.component";
import {File} from "@ionic-native/file";


declare var cordova: any;

@Component({
  selector: "WordpressUpdateNews",
	templateUrl: './wordpress-updatenews.html',
	providers: [ WordpressService ]
})
export class WordpressUpdateNews implements OnInit {

  url = this.config.wordpressApiUrl + '/wp/v2/media';

  photos: any;
  photo;
  base64Image: string;
  lastImage: boolean = false;
  photoUploaded: boolean = false;
  loading: Loading;
  content;
  title;
  photonewsid;
  token;
  lastImage2: string = null;

  post: any;
  authorData: any;
  user: any;

  formtitle: boolean = false;

  constructor(
    private config: Config,
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    public platform: Platform,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
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
    this.photos = [];
  }


  // display post

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


  // photo
  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Voulez-vous supprimer la photo?',
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



  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
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

    let loader = this.loadingController.create({
      content: "Enregistrement en cours",
      duration: 10000
    });

    loader.present();

	  let trans = this.transfer.create();
	  trans.upload(this.base64Image, this.url, {

	    fileName: newFileName,

	    headers: {
        'Authorization': `Bearer ${The_token}`,
        'Content-Disposition': 'attachment;'
      },
      params: {'fileName': newFileName}

    }).then((res) => {

      let imgId = JSON.parse(res.response);
      this.photonewsid = imgId.id;
      this.photoUploaded = true;
      loader.dismiss();
      this.presentToast('La photo est enregistrée !');

    }).catch((err)=> {
      // alert(JSON.stringify(err));
      this.presentToast('Erreur lors de l\'enregistrement de la photo.');
    })
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

    this.loading = this.loadingController.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, this.url, options).then(data => {
      console.log(data);
      let imgId = JSON.parse(data.response);
      this.photonewsid = imgId.id;
      this.photoUploaded = true;
      this.loading.dismissAll()
      this.presentToast('La Photo est bien enregistrée !');
      // this.goToPosts();
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Erreur pendant l\'upload, merci de réessayer !');
    });
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

  updateNews(id){
    let loader = this.loadingController.create({
      content: "Modification en cours ..."
    });
    loader.present();
    this.wordpressService.updateNewsbyId(id, this.title, this.content, this.photonewsid,this.token)
      .subscribe(result => {

          this.goToPosts()
        },
        error => console.log(error),
        () => loader.dismiss()
      );
  }



  goToPosts(): void {
    this.navController.push(WordpressPosts);
  }


  opentitle(){
    this.formtitle = true;
  }



}
