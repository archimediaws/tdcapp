import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';

import {ImgcaptureComponent} from "./imgcapture-component/imgcapture.component";

@NgModule({
  declarations: [
    ImgcaptureComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    ImgcaptureComponent
  ],
  entryComponents:[
  	ImgcaptureComponent
  ]
})
export class ImgcaptureModule {}
