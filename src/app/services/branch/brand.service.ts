import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  url = 'http://localhost:8081/';
  createBrand = this.url + 'brands';
  getBrand = this.url + 'brands';
  getById = this.url + 'brands/';
  updateById = this.url + 'brands/';
  deleteById = this.url + 'brands/';

  constructor(private _http: HttpClient) {}

  saveBrand(brand: any) {
    return this._http.post(this.createBrand, brand);
  }

  getBrandList(param: HttpParams): Observable<any> {
    return this._http.get<any[]>(this.getBrand, { params: param });
  }

  getBrandById(id: number) {
    return this._http.get<any>(this.getById + id);
  }

  updateBrandById(brand: any) {
    return this._http.put(this.updateById + brand.id, brand);
  }

  getBrands(limit: number, page: number): Observable<any> {
    const params = new HttpParams().set('_limit', limit).set('_page', page);

    return this._http.get<any>(this.getBrand, { params });
  }

  deleteBrandById(id: number): Observable<any> {
    return this._http.delete<any>(this.deleteById + id);
  }
}
