import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { SharedModule } from './shared/shared.module'
import { HomeModule } from '../pages/home/home.module';
import { TabsModule } from '../pages/tabs/tabs.module';
import { GoogleMapsModule } from '../pages/google-maps/google-maps.module';
import { WordpressModule } from '../pages/wordpress/wordpress.module';
import { SlidesModule } from '../pages/slides/slides.module';
import { SettingsModule } from '../pages/settings/settings.module';
import { AboutModule } from '../pages/about/about.module';
import { ContactModule } from '../pages/contact/contact.module';

import { OneSignal} from "@ionic-native/onesignal";

import { MyApp } from './app.component';
import {RestaurantModule} from "../pages/restaurant/restaurant.module";
import {DirectivesModule} from "../directives/directives.module";
import {ImgcaptureModule} from "../pages/imgcapture/imgcapture.module";
import {BarcodeScannerModule} from "../pages/barcode-scanner/barcode-scanner.module";
import { DataServiceProvider } from '../providers/data-service/data-service';
import { HttpModule } from '@angular/http';
import {SatisfactionModule} from "../pages/satisfaction/satisfaction.module";


@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    SharedModule,
    HomeModule,
    TabsModule,
    GoogleMapsModule,
    WordpressModule,
    SlidesModule,
    SettingsModule,
    AboutModule,
    ContactModule,
    RestaurantModule,
    DirectivesModule,
    ImgcaptureModule,
    BarcodeScannerModule,
    HttpModule,
    SatisfactionModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp

  ],
  providers: [
    CallNumber,
    File,
    Transfer,
    Camera,
    FilePath,
    {
    provide: ErrorHandler,
    useClass: IonicErrorHandler,
  },
  OneSignal,
    DataServiceProvider

  ]
})
export class AppModule {}
