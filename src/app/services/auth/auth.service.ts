import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { AuthGuardService } from './auth-guard.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = "http://localhost:8080";
  //apiUrl = "http://52.29.87.21:8080";
  currentstatus = new BehaviorSubject<boolean>(false);
  currentrole = new BehaviorSubject<any>("Reviewer");
  canEdit: boolean;
  canDelete: boolean;
  userToken: any;
  session: any;


  constructor(private http: HttpClient,
    private router: Router,
    private authGuard: AuthGuardService) {
    if (this.getPayload())
      this.session = this.getPayload();
  }

  onLogin(email: string, password: any) {
    password = Md5.hashStr(password);
    console.log("Hashed password : " + password);
    return this.http.post<any>(`${this.apiUrl}/authenticate`, { email, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log("Logged in, check localStorage")
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authGuard.isValid = true;
          this.setRole();
        }
        else {
          console.log("There is an error");
        }

        return user;

      }));
  }

  onReset(email: string) {
    return this.http.get<any>(this.apiUrl + "/api/password/" + email);
  }

  onChangePassword(token: string, password: any) {
    password = Md5.hashStr(password);
    return this.http.post<any>(`${this.apiUrl}/api/password/reset`, { token, password })

  }

  logout(term) {
    console.log("Logged out");
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentrole.next("Reviewer");
    this.deconnexion(term);
  }

  showOrHide(term: string, shown: boolean) {
    console.log(term)
    if (term == "password") {
      term = "text";
      shown = false;

      console.log("changed to text")
    }
    else if (term == "text") {
      term = "password";
      shown = true;

      console.log("changed to password")

    }

  }





  connexion(term) {
    term.next(true);
  }
  deconnexion(term) {
    term.next(false);
  }

  tokenDecoder(term) {
    return jwt_decode(term);
  }

  getPayload() {
    if (localStorage.getItem('currentUser') != null) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      console.log("User Token : " + this.userToken);
      return jwt_decode(this.userToken);
    }
    else
      return false;
  }

  setRole() {
    this.session = JSON.parse(localStorage.getItem('currentUser'));
    var a = this.getPayload();
    this.currentrole.next(a.role);


  }



}
