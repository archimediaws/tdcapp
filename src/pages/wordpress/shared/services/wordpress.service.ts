import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../../../../app/app.config';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Injectable()
export class WordpressService {

	constructor(private http: Http, private config: Config, private storage: Storage) {}

	/**
	*  Login width JWT on WP API
	**/

	public login(data) {
		let url = this.config.wordpressApiUrl + '/jwt-auth/v1/token';
		return this.http.post(url, data)
	  	.map(result => {
			return result.json();
		});
	}

  /**
   *  GET / POST / PUT / DELETE -> WP Posts( news)
   **/


  /** GET All Posts whith Query filter ( page, authors, catégories ...**/

	public getPosts(query) {
		query = this.transformRequest(query);
		let url = this.config.wordpressApiUrl + `/wp/v2/posts?${query}&_embed`;
		return this.http.get(url)
	  	.map(result => {
			return result.json();
		});
	}

  /** GET Post by Id **/
  public getPost(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/posts/${id}?_embed`)
	  	.map(result => {
			return result.json();
		});
	}


  /** POST WP News + Auth/ token **/

  public postNews(title, content, price, photomdjurl, token){

    let body = {
      title: title,
      content: content,
      status: 'publish',
      prix: price,
      photomdj: photomdjurl

    };

    let The_token = token.__zone_symbol__value.token;

    console.log(The_token);

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${The_token}` );
    headers.append('Content-Type', 'application/json');

    return this.http.post( this.config.wordpressApiUrl + '/wp/v2/posts/', JSON.stringify(body), {headers: headers})
      .map(result => {
        return result.json();

      });

  }

  /** DELETE WP News by Id  + auth / token **/
  public deleteNewsbyId(id, token) {
    let The_token = token.__zone_symbol__value.token;
    let headers =  {headers: new  Headers({
        'Authorization': `Bearer ${The_token}`,
        'Content-Type': 'application/json'
      })};
    return this.http.delete(this.config.wordpressApiUrl + `/wp/v2/posts/${id}?force=true`, headers)
      .map(result => {
        return result.json();
      });
  }




  /**
   *  GET / POST / DELETE -> WP Media( news, ...)
   **/


  /** GET All Media **/
  public getMedias() {
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/media`)
      .map(result => {
        return result.json();
      });
  }

  /** GET All Media query filter ( page) **/
  public getMoreMedias(query) {
    query = this.transformRequest(query);
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/media?${query}`)
      .map(result => {
        return result.json();
      });
  }

  /** GET Media by Id **/
  public getMedia(id) {
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/media/${id}`)
      .map(result => {
        return result.json();
      });
  }


  /** DELETE Media by Id  + auth / token **/
  public deleteMediabyId(id, token) {
    let The_token = token.__zone_symbol__value.token;
    let headers =  {headers: new  Headers({
        'Authorization': `Bearer ${The_token}`,
        'Content-Type': 'application/json'
      })};

    return this.http.delete(this.config.wordpressApiUrl + `/wp/v2/media/${id}?force=true`, headers)
      .map(result => {
        return result.json();
      });

  }

  /**
   *  GET / POST -> WP Categories( news, ...)
   **/

  public getCategories() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/categories?per_page=100')
		.map(result => {
			return result.json();
		});
	}


  /**
   *  GET / POST / DELETE -> WP Custom Posts Type ( menu_du_jour)
   **/

  /** GET All menu_du_jour **/
  public getNewsMenusduJour(){
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  /** GET All menu_du_jour with query filter ( page) **/
  public getMoreNewsMenusduJour(query){
    query = this.transformRequest(query);
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${query}`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  /** GET All menu_du_jour by Id **/
  public getNewsMenuduJourbyId(id) {
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${id}`)
      .map(result => {
        return result.json();
      });
  }


  /** POST menu_du_jour + Auth/ token **/

  public postMenuduJour(title, content, price, photomdjurl, token){

    let body = {
      title: title,
      content: content,
      status: 'publish',
      prix: price,
      photomdj: photomdjurl

    };

    let The_token = token.__zone_symbol__value.token;

    console.log(The_token);

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${The_token}` );
    headers.append('Content-Type', 'application/json');

    return this.http.post( this.config.wordpressApiUrl + '/wp/v2/menu_du_jour/', JSON.stringify(body), {headers: headers})
      .map(result => {
        return result.json();

      });

  }


  /** DELETE menu_du_jour by Id  + auth / token **/
  public deleteNewsMenuduJourbyId(id, token) {
    let The_token = token.__zone_symbol__value.token;
    let headers =  {headers: new  Headers({
        'Authorization': `Bearer ${The_token}`,
        'Content-Type': 'application/json'
      })};
    return this.http.delete(this.config.wordpressApiUrl + `/wp/v2/menu_du_jour/${id}?force=true`, headers)
      .map(result => {
        return result.json();
      });
  }


  /**
   *  GET  -> WP Custom Posts Type ( produits )
   **/


  /** GET All produits **/
  public getAllPodProduits(){
    let url = this.config.wordpressApiUrl + `/wp/v2/prod`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }


  /** GET All produits with query (page) **/
  public getMorePodProduits(query){
    query = this.transformRequest(query);
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${query}`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }



  /**
   *  GET  -> WP pages
   **/

  /** GET All pages **/
	public getPages() {
		return this.http.get(this.config.wordpressApiUrl + '/wp/v2/pages?per_page=100')
		.map(result => {
			return result.json();
		});
	}

  /** GET page by Id **/
	public getPage(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp/v2/pages/${id}`)
	  	.map(result => {
			return result.json();
		});
	}


  /**
   *  GET  -> WP menus
   **/

  /** GET All menus **/
	public getMenus() {
		return this.http.get(this.config.wordpressApiUrl + '/wp-api-menus/v2/menus')
		.map(result => {
			return result.json();
		});
	}

  /** GET menu by Id **/
	public getMenu(id) {
		return this.http.get(this.config.wordpressApiUrl + `/wp-api-menus/v2/menus/${id}`)
	  	.map(result => {
			return result.json();
		});
	}


	/** fx Transform Query + encode **/

	private transformRequest(obj) {
		let p, str;
		str = [];
		for (p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}



}
