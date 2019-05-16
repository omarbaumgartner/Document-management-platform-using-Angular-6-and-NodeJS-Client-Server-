import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from "jwt-decode";



//import { SigninComponent } from 'src/app/components/auth/signin/signin.component';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  //apiUrl = "http://52.29.87.21:8080";
  apiUrl = "http://localhost:8080";
  userToken: any;
  // isConnected: boolean;
  isValid: Object;
  noToken: boolean;
  observableConnected = new BehaviorSubject<boolean>(false);
  session: any;
  actualDate: number;



  constructor(private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute) {



    setInterval(() => {
      if (this.getPayload()) {
        this.session = this.getPayload();
        this.actualDate = new Date().getTime();
        const timestamp = Math.floor(this.actualDate / 1000);
        if (this.session.exp < timestamp && this.isValid != false) {
          this.observableConnected.next(false);
          this.isValid = false;
          console.log("Expired time")
          this.snackBar.open("Disconnected, please reconnect", "Close", {
            duration: 1500,
            verticalPosition: "top",
          });
          //this.isConnected = false;
          //console.log(this.isConnected)
          this.router.navigate(['/auth/signin']);
        }
      }
    }, 1 * 60 * 60)


    /*     if (this.noToken == false && this.isValid == true) {
          this.isConnected = true;
          this.observableConnected.next(true);
        }
        else {
          this.isConnected = false;
          this.observableConnected.next(false);
        } */
    //setInterval(() => this.updateToken(), 1000 * 1);
  }

  onCheckToken() {
    this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
    return this.http.get(this.apiUrl + '/authguard/' + this.userToken)
  }

  updateToken(): any {
    // console.log("Checking Token")
    if (localStorage.getItem('currentUser') && this.isValid != true) {
      this.onCheckToken()
        .subscribe(
          tokenvalidity => {
            //console.log("token validity : ", tokenvalidity)
            this.isValid = tokenvalidity;
            console.log("isValid : " + this.isValid)
            if (this.isValid != true) {
              this.router.navigate(['/auth/signin']);
              this.observableConnected.next(false);
              // this.isConnected = false;
            }
            else {
              // this.isConnected = true;
              this.noToken = false;
              this.observableConnected.next(true);
            }
          }

        )
    }
    else {
      //this.isConnected = false;
      this.observableConnected.next(false);
    }
    //console.log("No Token : " + this.noToken);
    //console.log("Token validity : " + this.isValid);
  }

  canActivate(): boolean {
    //console.log("isValid : " + this.isValid)
    //console.log("No Token : " + this.noToken);
    if (localStorage.getItem('currentUser')) {
      this.onCheckToken().subscribe((val) => {
        this.isValid = val;
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
      else if (this.isValid == false || !localStorage.getItem('currentUser')) {
        localStorage.removeItem('currentUser');
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

  //Optionnal : Login animation
  /*   openDialog(): void {
      const dialogRef = this.dialog.open(SigninComponent, {
        autoFocus: true,
      });
    } */


  logout() {
    this.isValid = false;
    localStorage.removeItem('currentUser');

  }

}
