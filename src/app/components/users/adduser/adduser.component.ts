import { Component } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {

  user = new User();
  submitted = false;
  addUserForm: FormGroup;
  errorMessage: string;
  showError: boolean = false;
  signUpForm: FormGroup;
  emailpattern = "@instadeep.com";
  passwordvalue: string;
  noError: boolean = false;
  takenEmail: boolean;
  matchedPassword: boolean;


  constructor(private formBuilder: FormBuilder,
    private userService: UsersService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar) {

  }

  get f() { return this.signUpForm.controls; }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z '-]+$/)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z '-]+$/)]],
      role: ['Reviewer',],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required]
    }, {
        validator: this.MustMatch('password', 'confirmpassword')
      });

  }

  // convenience getter for easy access to form fields

  onSubmit() {
    this.user.firstname = this.signUpForm.get('firstname').value;
    this.user.lastname = this.signUpForm.get('lastname').value;
    this.user.role = this.signUpForm.get('role').value;
    this.user.email = this.signUpForm.get('email').value + this.emailpattern;
    this.user.password = this.signUpForm.get('password').value;
    if (this.user.password != this.signUpForm.get('confirmpassword').value) {
      this.showError = true;
      this.errorMessage = "Both passwords don't match";
      this.matchedPassword = true;
    }
    this.userService.checkEmail(this.user.email)
      .subscribe((user) => {
        if (user == null) {
          this.addUser();
        }
        else {
          this.errorMessage = "Email is already taken";
          this.noError = true;
          this.takenEmail = true;
        }
      })
  }


  newUser(): void {
    this.submitted = false;
    this.user = new User();
  }

  goBack(): void {
    this.location.back();
  }

  private addUser(): void {
    const md5 = new Md5();
    this.user.password = md5.appendStr(this.user.password).end();
    this.userService.addUser(this.user)
      .subscribe(result => {
        this.userService.reloadUsers();
        this.snackBar.open("User has been added", "Close", {
          duration: 3000,
          verticalPosition: "bottom",
        });
      },
        () => {

        },
        () => {
          this.router.navigateByUrl('/users', { skipLocationChange: true }).then(() => this.router.navigate(["/users"]));
        });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }





}
