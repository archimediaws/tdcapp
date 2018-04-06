import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { SatisfactionComponent } from './satisfaction-component/satisfaction.component';

@NgModule({
  declarations: [
    SatisfactionComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    SatisfactionComponent
  ],
  entryComponents:[
  	SatisfactionComponent
  ]
})
export class SatisfactionModule {}
