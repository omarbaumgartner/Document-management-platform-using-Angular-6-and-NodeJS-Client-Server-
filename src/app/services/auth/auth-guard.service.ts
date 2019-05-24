import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from "jwt-decode";
import { Config } from 'src/app/configuration/conf';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  apiUrl = "http://" + Config.HOST + ":" + Config.PORT;
  userToken: any;
  isValid: Object;
  noToken: boolean;
  observableConnected = new BehaviorSubject<boolean>(false);
  session: any;
  actualDate: number;

  constructor(private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {

    setInterval(() => {
      //console.log("isValid : " + this.isValid);
      //console.log("noToken : " + this.noToken);
      //console.log("observableConnected : " + this.observableConnected.value);
      //console.log("session : ", this.session)
      if (localStorage.getItem('currentUser')) {
        this.session = this.getPayload();
        this.actualDate = new Date().getTime();
        const timestamp = Math.floor(this.actualDate / 1000);
        if (this.session.exp < timestamp && this.isValid != false) {
          console.log("isValid : " + this.isValid)
          this.observableConnected.next(false);
          this.isValid = false;
          this.snackBar.open("Disconnected, please reconnect", "Close", {
            duration: 1500,
            verticalPosition: "top",
          });
          this.router.navigate(['/auth/signin']);
          localStorage.removeItem('currentUser')
        }
      }
      else {
        this.session = undefined;
        this.isValid = false;
        this.observableConnected.next(false);
        this.noToken = true;
      }
    }, 500)
  }

  onCheckToken() {
    this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
    return this.http.get(this.apiUrl + '/authguard/' + this.userToken)
  }

  canActivate(): boolean {
    if (localStorage.getItem('currentUser')) {
      this.onCheckToken().subscribe((val) => {
        this.isValid = val;
      },
        (error) => {
          console.log("Error")
        },
        () => {

        })
      if (this.noToken == true && this.isValid == false || !localStorage.getItem('currentUser')) {
        localStorage.removeItem('currentUser');
        this.snackBar.open("You need to connect", "Close", {
          duration: 1500,
          verticalPosition: "top",
        });
        this.observableConnected.next(false);
        this.router.navigate(['/auth/signin']);

        return false;
      }
      // else if (this.isValid == false || !localStorage.getItem('currentUser')) {
      else if (!localStorage.getItem('currentUser')) {

        localStorage.removeItem('currentUser');
        console.log("isValid : " + this.isValid)
        this.snackBar.open("Disconnected, please reconnect", "Close", {
          duration: 1500,
          verticalPosition: "top",
        });
        this.observableConnected.next(false);
        this.router.navigate(['/auth/signin']);

        return false;

      }
      else {
        this.observableConnected.next(true);
        return true;
      }
    }
    else {
      localStorage.removeItem('currentUser')
      this.router.navigate(['/auth/signin']);
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

  logout() {
    this.isValid = false;
    localStorage.removeItem('currentUser');

  }

  updateToken(): any {
    // console.log("Checking Token")
    if (localStorage.getItem('currentUser') && this.isValid != true) {
      this.onCheckToken()
        .subscribe(
          tokenvalidity => {
            console.log("token validity : ", tokenvalidity)
            this.isValid = tokenvalidity;
            if (this.isValid != true) {
              localStorage.removeItem('currentUser')
              this.router.navigate(['/auth/signin']);
              this.observableConnected.next(false);
            }
            else {
              this.noToken = false;
              this.observableConnected.next(true);
            }
          }
        )
    }
    else {
      this.observableConnected.next(false);
    }
  }


  //Optionnal : Login animation
  /*   openDialog(): void {
      const dialogRef = this.dialog.open(SigninComponent, {
        autoFocus: true,
      });
    } */

}
