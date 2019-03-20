import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';


//import { SigninComponent } from 'src/app/components/auth/signin/signin.component';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  //apiUrl = "http://52.29.87.21:8080";
  apiUrl = "http://localhost:8080";
  userToken: any;
  isConnected: boolean;
  isValid: Object;
  noToken: boolean;



  constructor(private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.updateToken();
    setInterval(() => this.updateToken(), 1000 * 60);
  }

  onCheckToken() {
    this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
    return this.http.get(this.apiUrl + '/authguard/' + this.userToken)

  }

  updateToken(): any {
    if (localStorage.getItem('currentUser')) {
      this.onCheckToken()
        .subscribe(
          tokenvalidity => {
            console.log("token validity : ", tokenvalidity)
            this.isValid = tokenvalidity;
            this.noToken = false;

          }

        )
    }
    else {
      this.noToken = true;
      this.isValid = false;

    };
    //console.log("No Token : " + this.noToken);
    //console.log("Token validity : " + this.isValid);
  }



  canActivate(): boolean {
    // console.log("isValid : " + this.isValid)
    // console.log("No Token : " + this.noToken);
    if (this.noToken == true && this.isValid == false) {
      this.snackBar.open("You need to connect", "Close", {
        duration: 1500,
        verticalPosition: "top",

      });
      // console.log("Nope sorry")
      this.router.navigate(['/auth/signin']);

      return false;
    }
    else if (this.isValid == false) {
      this.snackBar.open("Disconnected, please reconnect", "Close", {
        duration: 1500,
        verticalPosition: "top",

      });
      //console.log("Nope sorry")
      this.router.navigate(['/auth/signin']);
      return false;

    }
    else {
      //console.log("You can enter")
      return true;
    }
  }




  //Optionnal : Login animation
  /*   openDialog(): void {
      const dialogRef = this.dialog.open(SigninComponent, {
        autoFocus: true,
      });
    } */

  logout() {
    console.log("Logged out");
    // remove user from local storage to log user out
    this.isConnected = false;
    this.isValid = false;
    localStorage.removeItem('currentUser');

  }

}
