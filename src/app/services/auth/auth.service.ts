import { Injectable, TemplateRef } from '@angular/core';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/User.model';
import { Observable, of, interval, Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = "http://localhost:8080";
  currentstatus = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) { }





  onlogin(email: string, password: any) {
    password = Md5.hashStr(password);
    console.log("Hashed password : " + password);
    return this.http.post<any>(`${this.apiUrl}/auths/authenticate`, { email, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log("Logged in, check localStorage")
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        else {
          console.log("There is an error");
        }
        return user;

      }));
  }

  logout() {
    // remove user from local storage to log user out
    console.log("Logged out");
    localStorage.removeItem('currentUser');
  }

  onAuth() {

  }

  connexion(term) {
    term.next(true);

  }

  deconnexion(term) {
    term.next(false);
  }




  // *ngIf="user$ | async as user"

  // *ngIf="(user$ | async) as user




  /* ------------- FireBase Auth

  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

    signOutUser() {
    firebase.auth().signOut();
  }

  */




}
