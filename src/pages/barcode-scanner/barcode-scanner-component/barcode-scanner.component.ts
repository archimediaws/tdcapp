import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import {DataServiceProvider} from "../../../providers/data-service/data-service";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {WordpressService} from "../../wordpress/shared/services/wordpress.service";

@Component({
  templateUrl: 'barcode-scanner.html',
  providers: [ WordpressService ]
})
export class BarcodeScannerComponent {

  urlformsatisfaction : string = "https://goo.gl/forms/1Yy6AoGTqZOnXSpC3";
  products: any[] = [];
  selectedProduct: any;
  productFound:boolean = false;

  podsproduits: any[] = [];
  selectedPod: any;
  podFound:boolean = false;

  vcard: string = "vcard";

  encodeData : string ;
  encodedData : {} ;

	constructor(
		public navCtrl: NavController,
		private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    private iab: InAppBrowser,
    private wordpressService: WordpressService,
		) {

    this.dataService.getProducts()
      .subscribe((response)=> {
        this.products = response;
        console.log(this.products);
      });



  }

  ngOnInit(): void {

    this.wordpressService.getAllPodProduits()
      .subscribe(result => {
        this.podsproduits = result;
        console.log("pods", this.podsproduits);
      });

  }


  // scan() {
  //   this.selectedProduct = {};
  //   this.barcodeScanner.scan().then((barcodeData) => {
  //     this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
  //
  //     if(this.selectedProduct !== undefined) {
  //       this.productFound = true;
  //     }
  //
  //     if(this.selectedProduct.plu === this.urlformsatisfaction ){
  //
  //       this.productFound = false;
  //       this.gotoSatisfactionform();
  //       this.toast.show(`formulaire de satisfaction`, '5000', 'center').subscribe(
  //         toast => {
  //           console.log(toast);
  //         }
  //       );
  //
  //     }
  //
  //     else{
  //       this.productFound = false;
  //       this.toast.show(`scan non valide`, '5000', 'center').subscribe(
  //         toast => {
  //           console.log(toast);
  //         }
  //       );
  //     }
  //   }, (err) => {
  //     this.toast.show(err, '5000', 'center').subscribe(
  //       toast => {
  //         console.log(toast);
  //       }
  //     );
  //   });
  // }

  scan() {
    this.selectedProduct = {};
    this.selectedPod = {};
    this.barcodeScanner.scan().then((barcodeData) => {
      this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
      this.selectedPod = this.podsproduits.find(podsproduit => podsproduit.plu === barcodeData.text);
      if(this.selectedProduct !== undefined) {
        this.productFound = true;
      }

      if(this.selectedPod !== undefined){
        this.podFound = true;
      }

      if(this.selectedProduct.plu === this.urlformsatisfaction ){

        this.productFound = false;
        this.gotoSatisfactionform();
        this.toast.show(`formulaire de satisfaction`, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );

      }

      if(this.selectedProduct.plu === this.vcard ){

        this.productFound = true;
        this.toast.show(`VCARD`, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );

      }

      else{
        this.productFound = false;
        this.podFound = false;
        this.toast.show(`scan non valide`, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }, (err) => {
      this.toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }


  encodeText(){
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,this.encodeData).then((encodedData) => {

      console.log(encodedData);
      this.encodedData = encodedData;

    }, (err) => {
      console.log("Error occured : " + err);
    });
  }

  gotoSatisfactionform(){

      const browser = this.iab.create(this.urlformsatisfaction, '_blank');
      browser.show();

  }
}
