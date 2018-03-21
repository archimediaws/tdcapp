import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from '../../../../app/app.config';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
// import {HttpHeaders} from "@angular/common/http";
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class WordpressService {

	constructor(private http: Http, private config: Config, private storage: Storage) {}

	public login(data) {
		let url = this.config.wordpressApiUrl + '/jwt-auth/v1/token';
		return this.http.post(url, data)
	  	.map(result => {
			return result.json();
		});
	}

	public getPosts(query) {
		query = this.transformRequest(query);
		let url = this.config.wordpressApiUrl + `/wp/v2/posts?${query}&_embed`;
		return this.http.get(url)
	  	.map(result => {
			return result.json();
		});
	}

	public getPost(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/posts/${id}?_embed`)
	  	.map(result => {
			return result.json();
		});
	}

	public getMedia(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/media/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getCategories() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/categories?per_page=100')
		.map(result => {
			return result.json();
		});
	}


	// START custom get post menu_du_jour

  public getMenusduJour(query) {
    query = this.transformRequest(query);
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour/?${query}&_embed`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });

  }

  public getNewsMenusduJour(){
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  public getMenuduJour(id) {
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/menu_du_jour/${id}?_embed`)
      .map(result => {
        return result.json();
      });
  }

  public postMenuduJour(title, content, price, token){

  let data = {
    title: title,
    content: content,
    status: 'publish',
    prix: price
  };
 console.log(data);
  let The_token = token.__zone_symbol__value.token;
     console.log(The_token);

  let headers =  {headers: new  Headers({ 'Authorization': `Bearer ${The_token}`, 'Content-Type': 'application/json'})};

  return this.http.post( this.config.wordpressApiUrl + '/wp/v2/menu_du_jour/', data,  headers);

  }


  // END custom post type menu_du_jour

	public getPages() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/pages?per_page=100')
		.map(result => {
			return result.json();
		});
	}

	public getPage(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/pages/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getMenus() {
		return this.http.get(this.config.wordpressApiUrl + '/wp-api-menus/v2/menus')
		.map(result => {
			return result.json();
		});
	}

	public getMenu(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp-api-menus/v2/menus/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	private transformRequest(obj) {
		let p, str;
		str = [];
		for (p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}

}
