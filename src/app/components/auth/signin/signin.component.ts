import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { first } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { UsersService } from 'src/app/services/users/users.service';



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

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private authGuard: AuthGuardService,
    private userService: UsersService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{2,15}/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{2,15}/)]],
    })

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.loadingService.isLoading();
    const email = this.signInForm.get('email').value + this.emailpattern;
    const password = this.signInForm.get('password').value;
    this.authService.onLogin(email, password)
      .pipe(first())
      .subscribe(
        data => {
          this.loadingService.isFinished();
          this.snackBar.open("Connected", "", {
            duration: 3000,
            verticalPosition: "top",
          });
          this.authGuard.updateToken();
          this.userService.getUserProfile();
          this.authGuard.noToken = false;
          //  this.router.navigate([this.returnUrl]);
          this.router.navigate(['/home']);
          this.authService.connexion(this.authService.currentstatus);
          this.dialog.closeAll();
        },
        error => {
          this.loadingService.isFinished();
          this.iserror = true;
          this.error = error.error.message;
        });
  }

  onReset() {
    const email = this.resetForm.get('email').value + this.emailpattern;
    this.authService.onReset(email)
      .subscribe(
        data => {
          if (data == true) {
            this.isResetting = false;
            this.isreseterror = false;
            this.snackBar.open("An email has been sent !", "Close", {
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



} 
