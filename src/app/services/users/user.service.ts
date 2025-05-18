import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:8081/';
  signUp = this.url + 'api/auth/signup';
  singIn = this.url + 'api/auth/signin';

  constructor(private _http: HttpClient) {}

  saveUser(user: any) {
    return this._http.post(this.signUp, user);
  }

  logIn(loginData: any): Observable<HttpResponse<any>> {
    return this._http.post<any>(this.singIn, loginData, {
      observe: 'response',
    });
  }
}
