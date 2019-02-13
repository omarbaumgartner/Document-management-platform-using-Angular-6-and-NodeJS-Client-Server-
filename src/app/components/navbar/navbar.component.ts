import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // déclaration d'une variable booléenne isAuth.
  isAuth = this.authService.isAuth;
  session: any;


  // injection de authService
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.session = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.session.user.email)
    }
    if (this.session = ! null) {
      //this.isAuth = true;
    }
    else { } //this.isAuth = false;

    this.isAuth.subscribe(() => {
      console.log("message");
    })

  }



  logout() {
    localStorage.removeItem('currentUser');
    //this.isAuth = false;
  }

}

