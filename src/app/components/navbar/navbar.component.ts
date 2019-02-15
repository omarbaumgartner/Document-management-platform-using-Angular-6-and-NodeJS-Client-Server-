import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isConnected: boolean;
  currentstatus = this.authService.currentstatus;
  session: any;


  constructor(private authService: AuthService,
    private router: Router) {
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })
  }

  ngOnInit() {

    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.authService.session = JSON.parse(localStorage.getItem('currentUser'));
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
    this.authService.deconnexion(this.currentstatus);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/signin']);
  }

  myProfile() {
    this.session = JSON.parse(localStorage.getItem('currentUser'));
    this.router.navigate(['/users/' + this.session.user.id]);

  }

}

