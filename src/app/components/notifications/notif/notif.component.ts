import { Component, OnInit } from '@angular/core';
import { Notif } from 'src/app/models/Notif.model';
import { NotifService } from 'src/app/services/notifications/notif.service';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.css']
})
export class NotifComponent implements OnInit {

  notifications: Notif[];
  session: any;
  subscription: any;
  slicing: number = 5;
  showed: boolean = false;
  notifnumber: number = 0;

  constructor(private notifService: NotifService) {
    this.subscription = this.notifService.observableNotifications
      .subscribe(notifications => {
        this.notifications = notifications;
        if (this.notifications.length != null)
          this.notifnumber = this.notifications.length;
      })
  }

  ngOnInit() {
    this.notifService.reloadNotifs();
    this.notifService.openNotifs()
      .subscribe((val) => {
        console.log("Done");
      })
  }

  get sortData() {
    if (this.notifications) {
      return this.notifications.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      });
    }
    else {
      return null;
    }

  }

  clearNotifs() {
    this.notifService.clearNotifs(this.notifService.session.id)
      .subscribe(val => {
        this.notifService.reloadNotifs();

      })
  }

  showAll() {
    this.showed = true;
    this.slicing = 50;
  }

  translateTime(creationTime: string) {
    let word: string[];
    let date: string[];
    let anotherDate: string[];
    let time: string[];
    word = creationTime.split("T");
    date = word;
    time = word[1].split(".");
    anotherDate = date[0].split("-");
    let finalDate = anotherDate[2] + "-" + anotherDate[1] + "-" + anotherDate[0];
    let finalTime = time[0];
    let finalReturn = finalDate + " at " + finalTime;

    return finalReturn;
  }
}
