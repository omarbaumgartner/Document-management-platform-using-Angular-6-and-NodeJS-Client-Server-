import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-singleuser',
  templateUrl: './singleuser.component.html',
  styleUrls: ['./singleuser.component.css']
})
export class SingleuserComponent implements OnInit {

  user = new User();
  submitted = false;
  message: string;
  modify: boolean;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

  update(): void {
    this.submitted = true;
    this.userService.updateUser(this.user)
      .subscribe(result => this.message = "User Updated Successfully!");
  }

  delete(): void {
    this.submitted = true;
    this.modify = true;
    this.userService.deleteUser(this.user.id)
      .subscribe(result => this.message = "User Deleted Successfully!");


  }

  goBack(): void {
    this.location.back();
  }

  onModify() {
    this.modify = true;
  }

  onModifyCancel() {
    this.modify = false;
  }

}