import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  apiUrl = "http://localhost:8080";
  isAuth : Observable<boolean>;
  onlogin(email: string, password: any) {
    password = Md5.hashStr(password);
    console.log(password);
    return this.http.post<any>(`${this.apiUrl}/auths/authenticate`, { email, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
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
    localStorage.removeItem('currentUser');
  }

  /*login(email: string, password: any) {
    //password = md5.appendStr("test123").end();
    //  this.key = Md5.hashStr('test123');
    password = Md5.hashStr(password);
    if (email == "email@gmail.com" && password == Md5.hashStr("test123")) {
      console.log("connected");
      return true;
    }
    else {
      console.log("Not connected");
      this.isConnected = false;
      return false;

    }
  }

  logout() {
    this.isConnected = false;
  } */





  /* FireBase Auth

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
  */
  signOutUser() {
    firebase.auth().signOut();
  }



}
