import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import {DataServiceProvider} from "../../../providers/data-service/data-service";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'barcode-scanner.html'
})
export class BarcodeScannerComponent {

  urlformsatisfaction : string = "https://goo.gl/forms/1Yy6AoGTqZOnXSpC3";
  products: any[] = [];
  selectedProduct: any;
  productFound:boolean = false;

	constructor(
		public navCtrl: NavController,
		private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    private iab: InAppBrowser,
		) {

    this.dataService.getProducts()
      .subscribe((response)=> {
        this.products = response
      });


  }


  scan() {
    this.selectedProduct = {};
    this.barcodeScanner.scan().then((barcodeData) => {
      this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);

      if(this.selectedProduct !== undefined) {
        this.productFound = true;
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

      else{
        this.productFound = false;
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


  gotoSatisfactionform(){

      const browser = this.iab.create(this.urlformsatisfaction, '_blank');
      browser.show();

  }
}
