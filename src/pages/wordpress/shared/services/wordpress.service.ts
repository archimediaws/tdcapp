import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../../../../app/app.config';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
// import {HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';

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

  // public getMenusduJour(query) {
  //   query = this.transformRequest(query);
  //   let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour/?${query}&_embed`;
  //   return this.http.get(url)
  //     .map(result => {
  //       return result.json();
  //     });
  //
  // }

  // get all mdj pods

  public getNewsMenusduJour(){
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  // get all mdj pods with query ( page, author )

  public getMoreNewsMenusduJour(query){
    query = this.transformRequest(query);
console.log(query);
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${query}`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }
  // get mdj media avec pods

  // public getmdjMedia(id) {
  //   return this.http.get(this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?media/${id}`)
  //     .map(result => {
  //       return result.json();
  //
  //     });
  // }

  // end get mdj media avec pods

  public getNewsMenuduJourbyId(id) {
    return this.http.get(this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${id}`)
      .map(result => {
        return result.json();
      });

  }

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


  // get all pods produits

  public getAllPodProduits(){
    let url = this.config.wordpressApiUrl + `/wp/v2/prod`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  // end get all pods produits

  // get all pods  produits with query ( page, author )

  public getMorePodProduits(query){
    query = this.transformRequest(query);
    let url = this.config.wordpressApiUrl + `/wp/v2/menu_du_jour?${query}`;
    return this.http.get(url)
      .map(result => {
        return result.json();
      });
  }

  // END get all pods  produits with query ( page, author )


  // get mdj media avec pods



 // public getSaveImage(mdjdata, token ): Observable<any>{
 //
 //    console.log("getsave", mdjdata);
 //
 //    let The_token = token.__zone_symbol__value.token;
 //
 //    let headers = new Headers({
 //      'Authorization': `Bearer ${The_token}`,
 //      'Content-Disposition':"attachment; filename='monimage.jpeg'",
 //      // 'Content-Type': 'application/x-www-form-urlencoded',
 //      'Content-Type': 'multipart/form-data'
 //
 //    });
 //    return this.http.post(this.config.wordpressApiUrl + '/wp/v2/media',{data:mdjdata},{headers:headers})
 //      .map(data=> data.json());
 //
 //  }


  // post Menu du Jour avec pods

  public postMenuduJour(title, content, price, token){

  let body = {
    title: title,
    content: content,
    status: 'publish',
    prix: price,
    photomdj: 'http://tdc.stephaneescobar.com/wp-content/uploads/2018/04/image.jpg',
  };
    console.log(body);
  let The_token = token.__zone_symbol__value.token;

console.log(The_token);

  // let headers =  {headers: new  Headers({
  //     'Authorization': `Bearer ${The_token}`,
  //     'Content-Disposition':"attachment; filename=\'photo\'.jpeg",
  //     'Content-Type': 'application/json'
  //     // 'Content-Type': 'multipart/form-data'
  //
  // })};


    let headers = new Headers();
    headers.append('Authorization', `Bearer ${The_token}` );
    headers.append('Content-Type', 'application/json');

  return this.http.post( this.config.wordpressApiUrl + '/wp/v2/menu_du_jour/', JSON.stringify(body), {headers: headers})
    .map(result => {
      return result.json();

    });

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


	// Transform Query

	private transformRequest(obj) {
		let p, str;
		str = [];
		for (p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}



}
