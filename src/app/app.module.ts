import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

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
    DirectivesModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp

  ],
  providers: [
    CallNumber,
    {
    provide: ErrorHandler,
    useClass: IonicErrorHandler,
  },
  OneSignal
  ]
})
export class AppModule {}
