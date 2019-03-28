import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  session: any;
  userToken: any;
  snav: any;

  constructor(private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.session = this.getPayload();
    console.log(this.session);

  }

  canActivate(): boolean {
    if (this.session.role == "Administrateur") {
      return true;
    }
    else {
      this.snackBar.open("You need permissions", "Close", {
        duration: 1500,
        verticalPosition: "top",

      });
      this.router.navigate(['/home']);
      return false;
    }

  }

  getPayload() {
    if (localStorage.getItem('currentUser') != null) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      return jwt_decode(this.userToken);
    }
    else
      return false;
  }
}
