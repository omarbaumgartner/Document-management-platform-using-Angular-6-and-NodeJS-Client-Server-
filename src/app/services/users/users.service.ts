import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/User.model';
import * as jwt_decode from "jwt-decode";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //private usersUrl = 'http://52.29.87.21:8080/api/users';  // URL to web api
  private usersUrl = 'http://localhost:8080/api/users';  // URL to web api

  user: User;
  userToken: any;
  userProfile = new BehaviorSubject<string>("");
  payload: any;
  people: Array<User>;
  observablePeople = new BehaviorSubject<User[]>(null);



  constructor(
    private http: HttpClient) {
    this.getUsers()
      .subscribe(
        users => {
          // this.users = users;
          this.observablePeople.next(users);
        }
      );
    if (localStorage.getItem('currentUser')) { this.getUserProfile(); }
    else {
      console.log("No Profile")
    }
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.usersUrl + "/id"}/${id}`;
    return this.http.get<User>(url);
  }

  getUserByToken(token: any): Observable<User> {
    const url = `${this.usersUrl + "/token"}/${token}`;
    return this.http.get<User>(url);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions);
  }

  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, httpOptions);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions);

  }

  getPayload() {
    if (localStorage.getItem('currentUser')) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      //console.log("User Token : " + this.userToken);
      return jwt_decode(this.userToken);
    }
  }

  checkEmail(email) {
    return this.http.get<User>(this.usersUrl + "/email/" + email);
  }

  fromIdToUsername(ids, users: User[]) {
    var i = 0;
    if (ids.length == undefined) {
      while (ids != users[i].id) {
        i++;
      }
      return users[i].firstname + " " + users[i].lastname;

    }
    else {
      var usernames = [];
      var j;
      for (i = 0; i < ids.length; i++) {
        j = 0;
        while (ids[i] != users[j].id && j < users.length - 1) {
          j++;
        }
        usernames.push(users[j].firstname + " " + users[j].lastname)
      }

    }
    return usernames;
  }




  getUserProfile() {
    this.payload = this.getPayload();
    //console.log("payload", this.payload);
    this.getUserById(this.payload.id)
      .subscribe(user => {
        this.userProfile.next(user.firstname[0] + user.lastname[0]);
      })
  }

  reloadUsers() {
    this.getUsers()
      .subscribe(
        users => {
          this.observablePeople.next(users);
        }
      );
  }

}