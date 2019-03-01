import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-singleuser',
  templateUrl: './singleuser.component.html',
  styleUrls: ['./singleuser.component.css']
})
export class SingleuserComponent implements OnInit {

  user = new User();
  submitted = false;
  message: string;
  userModify: boolean = false;
  adminModify: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {

  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id)
      .subscribe(user => this.user = user);
    if (JSON.parse(localStorage.getItem('currentUser'))) { this.authService.session = JSON.parse(localStorage.getItem('currentUser')); }
    this.onCheckAccount();

  }

  update(): void {
    this.submitted = true;
    this.userService.updateUser(this.user)
      .subscribe(result => {
        this.message = "User Updated Successfully!";
      });
  }

  delete(): void {
    this.submitted = true;
    this.adminModify = true;
    this.userService.deleteUser(this.user.id)
      .subscribe(result => this.router.navigate(['/users']));
  }

  goBack(): void {
    this.location.back();
  }

  onModify() {
    if (this.isAdmin == true)
      this.adminModify = true;
    else
      this.userModify = true;
  }

  onModifyCancel() {
    if (this.isAdmin == true)
      this.adminModify = false;
    else
      this.userModify = false;
  }

  onCheckAccount() {
    {
      this.authService.session = this.authService.getPayload();
      if ('/users/' + this.authService.session.id == this.router.url && this.authService.session.role != "Administrateur") {
        this.canEdit = true;
        console.log("OwnProfile => canEdit : " + this.canEdit);
      }

      else if (this.authService.session.role == "Administrateur") {
        this.canDelete = true;
        this.isAdmin = true;
        console.log("Admin => canEdit and canDelete : " + this.canDelete);
      }
      else {
        this.canEdit = false;
        this.canDelete = false;
        console.log("Visitor")
      }
    }
  }
}