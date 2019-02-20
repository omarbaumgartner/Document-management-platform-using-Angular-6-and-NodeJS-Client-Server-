import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';


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
  signUpForm: FormGroup;
  emailpattern = "@instadeep.com";



  constructor(private formBuilder: FormBuilder,
    private userService: UsersService,
    private location: Location) { }


  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern('[a-z]')]],
      lastname: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{2,15}/)]],
      role: ['Reviewer',],
      email: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/[0-9a-zA-Z]{2,15}/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required]
    }, {
        validator: this.MustMatch('password', 'confirmpassword')
      });

  }

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.user.firstname = this.signUpForm.get('firstname').value;
    this.user.lastname = this.signUpForm.get('lastname').value;
    this.user.role = this.signUpForm.get('role').value;
    this.user.email = this.signUpForm.get('email').value + this.emailpattern;
    this.user.password = this.signUpForm.get('password').value;
    this.save();
    this.goBack();
  }


  newUser(): void {
    this.submitted = false;
    this.user = new User();
  }

  addUser() {
    this.submitted = true;
    this.save();
  }

  goBack(): void {
    this.location.back();
  }

  private save(): void {
    const md5 = new Md5();
    this.user.password = md5.appendStr(this.user.password).end();
    this.userService.addUser(this.user)
      .subscribe();
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
