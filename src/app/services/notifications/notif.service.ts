import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notif } from 'src/app/models/Notif.model';
import * as jwt_decode from "jwt-decode";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class NotifService {
  private notifsUrl = 'http://localhost:8080/api/notif/';  // URL to web api

  notifs: Notif[];
  observableNotifications = new BehaviorSubject<Notif[]>(null);
  observableInbox = new BehaviorSubject<boolean>(null);
  session: any;
  userToken: any;


  constructor(private http: HttpClient) {
    if (this.session) {
      this.session = this.getPayload();
      this.getNotifs(this.session.id)
        .subscribe(notifs => {
          if (notifs) {
            this.observableNotifications.next(notifs);
            for (let i = 0; i < notifs.length; i++) {
              if (notifs[i].opened == false) {
                this.observableInbox.next(true);
              }

            }
          }
        })
    }

  }

  getNotifs(id: number): Observable<Notif[]> {
    return this.http.get<Notif[]>(this.notifsUrl + id);
  }

  openNotifs() {
    this.observableInbox.next(false);
    return this.http.get<any>(this.notifsUrl + "open/" + this.session.id);
  }

  getPayload() {
    if (localStorage.getItem('currentUser')) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      console.log("User Token : " + this.userToken);
      return jwt_decode(this.userToken);
    }
  }

  reloadNotifs() {
    this.session = this.getPayload();
    this.getNotifs(this.session.id)
      .subscribe(
        notifications => {
          console.log(notifications);
          this.observableNotifications.next(notifications);
        }
      );
  }


}
