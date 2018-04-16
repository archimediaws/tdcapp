import { Component } from '@angular/core';

// import { NavController, Platform } from 'ionic-angular';
// import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
// import { Geolocation } from '@ionic-native/geolocation';

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

  // map: GoogleMap;

  // constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, public platform : Platform) {
  //
  //   platform.ready().then(() => {
  //     this.loadMap();
  //   });
  // }
  //
  // loadMap() {
  //   this.map = new GoogleMap('map');
  //
  //   this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
  //     console.log('Map is ready!');
  //   });
  // }

}

