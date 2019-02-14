import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isConnected: boolean;
  currentstatus = this.authService.currentstatus;
  session: any;

  constructor(private authService: AuthService) {
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })
  }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.session = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.session.user.email)
      if (this.session = ! null) {
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
    this.authService.deconnexion(this.currentstatus);
    localStorage.removeItem('currentUser');
  }

}

