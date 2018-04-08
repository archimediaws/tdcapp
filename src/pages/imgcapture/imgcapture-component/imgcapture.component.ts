import { Component } from '@angular/core';
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
  templateUrl: 'imgcapture.html'
})
export class ImgcaptureComponent {


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
    public alertCtrl : AlertController) { }


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



  // sendData(imageData) {
  //   this.userData.imageB64 = imageData;
  //   this.userData.user_id = "1";
  //   this.userData.token = "222";
  //   console.log(this.userData);
  //   this.authService.postData(this.userData, "userImage").then(
  //     result => {
  //       this.responseData = result;
  //     },
  //     err => {
  //       // Error log
  //     }
  //   );
  // }

  // public presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Load from Library',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //         }
  //       },
  //       {
  //         text: 'Use Camera',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.CAMERA);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  // public takePicture(sourceType) {
  //   // Create options for the Camera Dialog
  //   var options = {
  //     quality: 100,
  //     sourceType: sourceType,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   };

    // Get the data of an image
  //   this.camera.getPicture(options).then((imagePath) => {
  //     // Special handling for Android library
  //     if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  //       this.filePath.resolveNativePath(imagePath)
  //         .then(filePath => {
  //           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //           let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
  //           this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //         });
  //     } else {
  //       var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
  //       var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
  //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //     }
  //   }, (err) => {
  //     this.presentToast('Error while selecting image.');
  //   });
  // }

  // Create a new name for the image
  // private createFileName() {
  //   var d = new Date(),
  //     n = d.getTime(),
  //     newFileName =  n + ".jpg";
  //   return newFileName;
  // }

// // Copy the image to a local folder
//   private copyFileToLocalDir(namePath, currentName, newFileName) {
//     this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
//       this.lastImage = newFileName;
//     }, error => {
//       this.presentToast('Error while storing file.');
//     });
//   }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
//   public pathForImage(img) {
//     if (img === null) {
//       return '';
//     } else {
//       return cordova.file.dataDirectory + img;
//     }
//   }

  // public uploadImage() {
  //   // Destination URL
  //   var url = "http://yoururl/upload.php";
  //
  //   // File for Upload
  //   var targetPath = this.pathForImage(this.lastImage);
  //
  //   // File name only
  //   var filename = this.lastImage;
  //
  //   var options = {
  //     fileKey: "file",
  //     fileName: filename,
  //     chunkedMode: false,
  //     mimeType: "multipart/form-data",
  //     params : {'fileName': filename}
  //     // httpMethod: 'POST'
  //   };
  //
  //   const fileTransfer: TransferObject = this.transfer.create();
  //
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Uploading...',
  //   });
  //   this.loading.present();
  //
  //   // Use the FileTransfer to upload the image
  //   fileTransfer.upload(targetPath, url, options).then(data => {
  //     this.loading.dismissAll()
  //     this.presentToast('Image succesful uploaded.');
  //   }, err => {
  //     this.loading.dismissAll()
  //     this.presentToast('Error while uploading file.');
  //   });
  // }


}
