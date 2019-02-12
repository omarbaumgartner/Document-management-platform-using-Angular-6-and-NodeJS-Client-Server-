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
  isAuth: boolean;
  idu: string;
  ida: string;
  test: string;


  // injection de authService
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UsersService) { }

  ngOnInit() {
    // firebase.auth().onAuthStateChanged sera déclenché à chaque fois que l’état d’authentifcation est changé par l’utilisateur
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;
          // L'utilisateur est connecté
        } else {
          this.isAuth = false;
          // L'utilisateur n'est pas connecté
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
  }



}

