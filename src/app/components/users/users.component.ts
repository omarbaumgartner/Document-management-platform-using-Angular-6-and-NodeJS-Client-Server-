import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth/auth.service';

const URL = 'http://localhost:8080/api/upload';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  role: any;

  constructor(private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private loadingService: LoadingService) {
    this.loadingService.isLoading();
    this.authService.currentrole.subscribe((val) => {
      this.role = val;
    })
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    return this.userService.getUsers()
      .subscribe(
        users => {
          this.users = users
          this.loadingService.isFinished();

        }
      );
  }

  viewProfile(id: any) {
    this.router.navigate(['/users/' + id]);
  }

}
