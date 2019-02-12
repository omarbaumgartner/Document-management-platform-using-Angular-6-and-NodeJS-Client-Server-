import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
    console.log(this.user);
    this.userService.addUser(this.user)
      .subscribe();
  }

}
