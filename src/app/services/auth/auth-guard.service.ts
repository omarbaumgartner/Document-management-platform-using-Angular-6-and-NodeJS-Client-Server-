import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';



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
  observableConnected = new BehaviorSubject<boolean>(false);



  constructor(private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {


    if (this.noToken == false && this.isValid == true) {

      this.isConnected = true;
      this.observableConnected.next(true);

    }
    else {
      this.isConnected = false;
      this.observableConnected.next(false);

    }

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
    console.log("isValid : " + this.isValid)
    console.log("No Token : " + this.noToken);
    if (this.noToken == true && this.isValid == false) {
      localStorage.removeItem('currentUser');
      this.snackBar.open("You need to connect", "Close", {
        duration: 1500,
        verticalPosition: "top",

      });
      //  console.log("Nope sorry")
      this.isConnected = false;
      this.observableConnected.next(false);
      this.router.navigate(['/auth/signin']);
      console.log(this.isConnected)
      return false;
    }
    else if (this.isValid == false) {
      localStorage.removeItem('currentUser');
      this.snackBar.open("Disconnected, please reconnect", "Close", {
        duration: 1500,
        verticalPosition: "top",

      });
      // console.log("Nope sorry")
      this.isConnected = false;
      this.observableConnected.next(false);

      console.log(this.isConnected)

      this.router.navigate(['/auth/signin']);
      return false;

    }
    else {
      // console.log("You can enter")
      this.isConnected = true;
      this.observableConnected.next(true);

      console.log(this.isConnected)
      return true;
    }
  }

  testing() {
    console.log(this.isConnected);
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
