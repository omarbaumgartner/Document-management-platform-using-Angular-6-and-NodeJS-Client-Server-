import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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


  constructor(
    private userService: UsersService,
    private location: Location,
    private formBuilder: FormBuilder
  ) { }

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




}
