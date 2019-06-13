import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Md5 } from 'ts-md5/dist/md5';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';


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
  userProfile: any;
  userPassword: string = "password";
  togglePassword: boolean = true;
  password: FormControl;
  id: number;



  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar) {
    this.loadingService.isLoading();

  }

  ngOnInit(): void {
    this.password = new FormControl("*********", [Validators.required, Validators.minLength(6)]);
    this.id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(this.id)
      .subscribe(user => {
        this.user = user
        this.loadingService.isFinished();
        this.userProfile = user.firstname[0] + user.lastname[0];
        // this.user.password = "**********";
      });
    if (JSON.parse(localStorage.getItem('currentUser'))) { this.authService.session = JSON.parse(localStorage.getItem('currentUser')); }
    this.onCheckAccount();


  }

  editUser(): void {
    this.submitted = true;
    const md5 = new Md5();
    console.log("password is : " + this.password.value);
    this.user.password = md5.appendStr(this.password.value).end();
    console.log("hashed password is : " + this.user.password)
    //console.log(this.user.password);
    this.userService.updateUser(this.user)
      .subscribe(result => {
        this.submitted = false;
        if (this.adminModify == true) {
          this.adminModify = false;
        }
        else if (this.userModify == true)
          this.userModify = false;
      },
        () => {

        },
        () => {
          this.snackBar.open("User has been updated", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        });
  }

  deleteUser(): void {
    this.submitted = true;
    this.adminModify = true;
    this.userService.deleteUser(this.user.id)
      .subscribe(result => {
        this.userService.reloadUsers();
        this.snackBar.open("User has been deleted", "Close", {
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
    else {
      this.userService.getUserById(this.id)
        .subscribe(user => {
          this.user = user
          this.userProfile = user.firstname[0] + user.lastname[0];
        });
      this.userModify = false;
    }
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

  clearPassword() {
    this.password.setValue("");
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