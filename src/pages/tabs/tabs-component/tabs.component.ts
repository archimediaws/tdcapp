import { Component } from '@angular/core';

import { HomeComponent } from '../../home/home-component/home.component';
import { ContactComponent } from '../../contact/contact-component/contact.component';
import {WordpressPosts} from "../../wordpress/wordpress-posts/wordpress-posts.component";
import {WordpressMenusdujour} from "../../wordpress/wordpress-menusdujour/wordpress-menusdujour.component";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  tab1Root: any = HomeComponent;
  tab2Root: any = WordpressMenusdujour;
  tab3Root: any = WordpressPosts;
  tab4Root: any = ContactComponent;

  constructor() {

  }
}
