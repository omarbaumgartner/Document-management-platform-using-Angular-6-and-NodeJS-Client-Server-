import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = "http://localhost:8080";
  currentstatus = new BehaviorSubject<boolean>(false);
  session: any;
  canEdit: boolean;
  canDelete: boolean;
  userToken: any;


  constructor(private http: HttpClient,
    private router: Router) {
  }

  onlogin(email: string, password: any) {
    password = Md5.hashStr(password);
    console.log("Hashed password : " + password);
    return this.http.post<any>(`${this.apiUrl}/authenticate`, { email, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log("Logged in, check localStorage")
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.session = JSON.parse(localStorage.getItem('currentUser'));
        }
        else {
          console.log("There is an error");
        }

        return user;

      }));
  }

  logout(term) {
    console.log("Logged out");
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.deconnexion(term);
  }

  connexion(term) {
    term.next(true);
  }

  deconnexion(term) {
    term.next(false);
  }

  tokenDecoder(term) {
    term = jwt_decode(term);
  }

  getPayload() {
    this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
    console.log("User Token : " + this.userToken);
    return jwt_decode(this.userToken);

  }

  getToken() {
    this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
    return this.userToken;
  }

}
