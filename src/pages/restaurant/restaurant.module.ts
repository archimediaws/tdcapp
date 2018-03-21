import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { RestaurantComponent } from './restaurant-component/restaurant.component';

@NgModule({
  declarations: [
    RestaurantComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    RestaurantComponent
  ],
  entryComponents:[
  	RestaurantComponent
  ]
})
export class RestaurantModule {}
