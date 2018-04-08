
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataServiceProvider {

  constructor(public http: Http) {

  }
  getProducts(){
    return this.http.get('assets/data/products.json')
      .map((response:Response)=>response.json());
  }
}
