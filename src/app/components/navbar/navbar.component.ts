import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isConnected: boolean;
  currentstatus = this.authService.currentstatus;
  session: any;
  userToken: any;
  testing: any;
  test: any;
  user: import("/home/omar/Bureau/WebClient/src/app/models/User.model").User;



  constructor(private authService: AuthService,
    private userSerivce: UsersService,
    private router: Router) {
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })
  }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.authService.session = this.authService.getPayload();
      console.log(this.authService.session)
      if (this.authService.session = ! null) {
        this.connect();
      }
    }
    else {
      this.logout();
    }
  }

  connect() {
    this.authService.connexion(this.currentstatus);
  }


  logout() {
    this.authService.logout(this.currentstatus);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/signin']);
  }

  myProfile() {
    this.session = this.authService.getPayload();
    console.log(this.session);
    this.router.navigate(['/users/' + this.session.id]);

  }

  testbutton() {
    if (localStorage.getItem('currentUser')) {
      this.userToken = this.authService.getToken();
      this.userSerivce.getUserByToken(this.userToken)
        .subscribe(user => this.user = user);
      console.log(this.user);
    }
  }
}


