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

  post: any;
  authorData: any;
  user: any;


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



  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  // addNews(){
  //   let loader = this.loadingController.create({
  //     content: "Création de l'actualité en cours..."
  //   });
  //   loader.present();
	//   this.wordpressService.postNews(this.title, this.content, this.photonewsid, this.token).subscribe(data => {
	//     console.log(data);
  //     loader.dismiss();
  //   });
  //
	//   this.goToPosts();
  // }

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

  deleteNews(id){

    //  Alerte de confirmation
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression est définitive',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'    //  annuler
        },
        {
          text: 'Oui',
          handler: () => {    //  Si oui
            //  On supprime la news sur WP API
            let loader = this.loadingController.create({
              content: "Suppression en cours ..."
            });
            loader.present();

            this.wordpressService.deleteNewsbyId(id, this.token).subscribe(response => {

              console.log(response);
              loader.dismiss()
              if( response["deleted"]=== true  ) {
                // retour posts

                this.goToPosts();
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

  goToPosts(): void {
    this.navController.push(WordpressPosts);
  }






}
