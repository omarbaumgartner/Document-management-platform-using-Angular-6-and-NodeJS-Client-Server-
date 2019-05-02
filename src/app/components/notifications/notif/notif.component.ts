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

  constructor(private notifService: NotifService) {
    this.subscription = this.notifService.observableNotifications
      .subscribe(notifications => {
        this.notifications = notifications;
        console.log(this.notifications)
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

  showAll() {
    this.showed = true;
    this.slicing = 50;
  }
}
