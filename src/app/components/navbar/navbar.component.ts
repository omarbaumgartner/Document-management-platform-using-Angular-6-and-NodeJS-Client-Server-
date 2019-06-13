import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';
import { MatDialog, MatSidenav } from '@angular/material';
import { SigninComponent } from '../auth/signin/signin.component';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { AppComponent } from 'src/app/app.component';
import { LoadingService } from 'src/app/services/loading.service';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { NotifService } from 'src/app/services/notifications/notif.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentstatus = this.authService.currentstatus;
  session: any;
  userToken: any;
  user: User;
  userRole: string;
  currentrole = this.authService.currentrole;
  role: any;
  activePage: any;
  userProfile: any;
  searchWord: string = "";
  subscription: any;
  testing: boolean;
  inboxNotification: boolean;
  isConnected: boolean;
  noError: boolean;

  constructor(private authService: AuthService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private userService: UsersService,
    private managerService: ManagerService,
    private router: Router,
    public loadingService: LoadingService,
    public notifService: NotifService,
    public dialog: MatDialog) {

    this.authService.currentrole.subscribe((val) => {
      this.role = val;
    })

    this.userService.userProfile.subscribe((val) => {
      this.userProfile = val;
    })

    this.subscription = this.notifService.observableInbox
      .subscribe(val => {
        this.inboxNotification = val;
      })



  }

  ngOnInit() {
    this.searchWord = null;
    this.subscription = this.authGuardService.observableConnected
      .subscribe((val) => {
        this.isConnected = val;
      })

    this.router.events
      .subscribe(event => {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        //console.log(currentRoute.snapshot.data);
        this.loadingService.activePage = currentRoute.snapshot.data.name;
        this.activePage = currentRoute.snapshot.data.name;
      })


    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.session = this.authService.getPayload();
      //console.log(this.session);
      this.userService.getUserById(this.session.id)
        .subscribe((user) => {
          this.user = user;
          this.userRole = user.role;
        })
      if (this.session = ! null) {
        this.connect();
      }
    }
    else {
      this.disconnect();
    }
  }

  connect() {
    this.authService.connexion(this.currentstatus);
  }

  disconnect() {
    this.authService.deconnexion(this.currentstatus);
  }


  logout() {
    this.isConnected = false;
    this.userRole = null;
    localStorage.removeItem('currentUser');
    this.authService.logout(this.currentstatus);
    this.authGuardService.isValid = false;
    this.authGuardService.observableConnected.next(false);
    this.router.navigate(['/auth/signin']);
  }

  getMyProfile() {
    this.session = this.authService.getPayload();
    //console.log(this.session);
    this.router.navigate(['/users/' + this.session.id]);
  }

  navigateTo(url) {
    this.router.navigate([url.toString()])
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SigninComponent, {
      autoFocus: true,
    });
  }

  toggle(term) {
    this.loadingService.toggle(term)
  }

  searchFor(term) {
    let session = this.authService.getPayload();
    if (term.includes("/") == true || term.includes("\\") == true) {
      this.noError = true;
    }
    else {
      this.managerService.reloadProjects();
      this.managerService.reloadDocuments();
      this.noError = false;
      this.managerService.onRestrictedResearch(term, session.id);
      this.searchWord = "";
    }
  }


}


