import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';
import { MatDialog } from '@angular/material';
import { SigninComponent } from '../auth/signin/signin.component';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isConnected = this.authGuardService.isConnected;
  currentstatus = this.authService.currentstatus;
  session: any;
  userToken: any;
  user: User;
  userRole: string;
  currentrole = this.authService.currentrole;
  role: any;



  constructor(private authService: AuthService,
    private authGuardService: AuthGuardService,
    private userSerivce: UsersService,
    private router: Router,
    public dialog: MatDialog) {
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })
    this.authService.currentrole.subscribe((val) => {
      this.role = val;
    })
  }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.session = this.authService.getPayload();
      console.log(this.session);
      this.userSerivce.getUserById(this.session.id)
        .subscribe((user) => {
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
    this.userRole = null;
    localStorage.removeItem('currentUser');
    this.authService.logout(this.currentstatus);
    this.authGuardService.isValid = false;
    this.router.navigate(['/auth/signin']);
  }

  myProfile() {
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
}


