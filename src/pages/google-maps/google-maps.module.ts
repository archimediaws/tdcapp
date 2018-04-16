import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { GoogleMapsComponent } from './google-maps-component/google-maps.component';
import { AgmCoreModule } from '@agm/core';





@NgModule({
  declarations: [
    GoogleMapsComponent,


  ],
  imports: [
  	CommonModule,
  	SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAS8GiwwGyL81kXWlbCrD-5huNKXGbr4Js'
    })
  ],
  exports: [
    GoogleMapsComponent
  ],
  entryComponents:[
  	GoogleMapsComponent
  ]
})
export class GoogleMapsModule {}
