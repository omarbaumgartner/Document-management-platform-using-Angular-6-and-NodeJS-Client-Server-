import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { first } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AppComponent } from 'src/app/app.component';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;
  resetForm: FormGroup;
  returnUrl: string;
  emailpattern = "@instadeep.com";
  error: any;
  iserror: boolean;
  reseterror: any;
  isResetting: boolean;
  isreseterror: boolean;
  userPassword: string = "password";
  togglePassword: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private authGuard: AuthGuardService,
    private userService: UsersService,
    public dialog: MatDialog,
    private appComponent: AppComponent) {

  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)]],
    })

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.loadingService.isLoading();
    const email = this.signInForm.get('email').value + this.emailpattern;
    const password = this.signInForm.get('password').value;
    this.authService.onLogin(email.toLocaleLowerCase(), password)
      .pipe(first())
      .subscribe(
        data => {
          console.log("isValid : " + this.authGuard.isValid);

          this.authGuard.noToken = false;
          this.authGuard.isValid = true;
          this.authGuard.observableConnected.next(true);
          this.authService.connexion(this.authService.currentstatus);

          //  this.router.navigate([this.returnUrl]);
          //this.dialog.closeAll();
          console.log("isValid : " + this.authGuard.isValid);
        },
        error => {
          console.log("isValid : " + this.authGuard.isValid);

          this.loadingService.isFinished();
          this.iserror = true;
          this.error = error.error.message;
        }, () => {
          this.authGuard.updateToken();
          this.userService.getUserProfile();
          this.appComponent.ngOnInit();
          this.loadingService.isFinished();
          this.snackBar.open("Connected", "", {
            duration: 3000,
            verticalPosition: "top",
          });
          this.router.navigate(['/home']);

          console.log("isValid : " + this.authGuard.isValid);

        });
  }

  onReset() {
    const email = this.resetForm.get('email').value + this.emailpattern;
    this.authService.onReset(email.toLocaleLowerCase())
      .subscribe(
        data => {
          if (data == true) {
            this.isResetting = false;
            this.isreseterror = false;
            this.snackBar.open("An email recovery has been sent !", "Close", {
              duration: 3000,
              verticalPosition: "top",
            });
          }
          else {
            this.isreseterror = true;
            this.reseterror = "No email found";
          }
        });
  }

  onPassword() {
    if (this.userPassword == "text") {
      this.userPassword = "password"
      this.togglePassword = true;
    }
    else {
      this.userPassword = "text";
      this.togglePassword = false;
    }
  }


} 
