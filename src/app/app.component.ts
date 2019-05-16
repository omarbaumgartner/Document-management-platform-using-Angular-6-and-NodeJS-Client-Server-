import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from './services/loading.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { ManagerService } from './services/manager/manager.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { NotifService } from './services/notifications/notif.service';
import { Notif } from './models/Notif.model';
import * as jwt_decode from "jwt-decode";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  toggled: boolean;
  load: boolean;
  isloading = this.loadingService.isloading;
  isConnected: boolean;
  currentstatus = this.authService.currentstatus;
  currentrole = this.authService.currentrole;

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loadingTemplate: TemplateRef<any>;
  public primaryColour = '#dd0031';
  session: any;
  role: any;
  activePage: any;
  subscription: any;
  notifications: Notif[];
  inboxNotification: boolean = false;
  sideNav: boolean;
  userToken: any;


  constructor(public loadingService: LoadingService,
    private authService: AuthService,
    private authGuardService: AuthGuardService,
    private notifService: NotifService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog) {


    this.session = this.getPayload();

    this.isloading.subscribe((val) => {
      this.load = val;
    })

    this.authService.currentrole.subscribe((val) => {
      this.role = val;
    })

    this.authGuardService.observableConnected.subscribe((val) => {
      this.sideNav = val;
    })

  }
  ngOnInit() {
    this.subscription = this.notifService.observableInbox
      .subscribe(val => {
        this.inboxNotification = val;
      })
    setInterval(() => {
      console.log("Interval : getNotif")
      if (this.session != undefined && this.inboxNotification != true) {
        this.notifService.getNotifs(this.session.id)
          .subscribe((notifications) => {
            for (let i = 0; i < notifications.length; i++) {
              if (notifications[i].opened == false) {
                this.snackbar.open(notifications[i].message, "Close", {
                  duration: 3000,
                  verticalPosition: "top",
                });
                this.notifService.observableInbox.next(true);
              }
            }
          })
      }
    }, 60000);


    if (localStorage.getItem('currentUser')) {
      this.authService.setRole();
    }
    this.subscription = this.authGuardService.observableConnected
      .subscribe((val) => {
        this.isConnected = val;
      })
  }


  toggle(term) {
    this.loadingService.toggle(term);
    if (this.toggled == true)
      this.toggled = false;
    else
      this.toggled = true;
  }

  getPayload() {
    if (localStorage.getItem('currentUser')) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      // console.log("User Token : " + this.userToken);
      return jwt_decode(this.userToken);
    }
    else
      return undefined;
  }
  /*   openUploader(): void {
      const dialogRef = this.dialog.open(UploadersComponent, {
        autoFocus: true,
      });
    } */
}
