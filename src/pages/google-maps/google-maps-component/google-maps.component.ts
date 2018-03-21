import { Component } from '@angular/core';



@Component({
  selector:'page-GoogleMaps',
  templateUrl: 'google-maps.html'
})
export class GoogleMapsComponent {
  // Google Map zoom level
  zoom: number = 15;

  // Google Map center
  latitude: number = 42.734859;
  longitude: number = 2.891971;


}

