import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public wordpressApiUrl = 'https://tdc.stephaneescobar.com/wp-json';
	public wordpressMenusNavigation = false;
	public emailTo = 'contact@latabledecana-perpignan.com';
}
