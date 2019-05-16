import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Project } from 'src/app/models/Project.model';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-myprojects',
  templateUrl: './myprojects.component.html',
  styleUrls: ['./myprojects.component.css']
})
export class MyprojectsComponent implements OnInit {
  session: any;
  myprojects: Project[];
  expanded: Array<boolean> = [false];
  sliced: Array<number> = [100];
  subscription: any;
  users: User[];

  constructor(private authService: AuthService,
    private userService: UsersService,
    private managerService: ManagerService,
    public loadingService: LoadingService,
    private router: Router) {
    this.userService.reloadUsers();
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.getMyProjects();
    this.subscription = this.userService.observablePeople
      .subscribe(users => {
        this.users = users;
        //console.log(this.users)
        //this.loadingService.isFinished();
      })
  }

  getMyProjects() {
    this.session = this.authService.getPayload();
    this.managerService.getUserProjects(this.session.id)
      .subscribe(
        projects => {
          this.myprojects = projects;
          this.loadingService.isFinished();
        }
      )
  }

  singleProject(id) {
    this.router.navigate(['/myprojects/' + id]);

  }

  translatemeArray(ids) {
    return this.userService.fromIdToUsername(ids, this.users);

  }
  slice(i) {
    if (!this.sliced[i]) {
      this.sliced[i] = 100;
      return this.sliced[i].valueOf();
    }
    else {
      this.sliced[i] == 1000
      return this.sliced[i].valueOf();
    }

  }

  seeMore(i) {
    if (this.sliced[i] == 100) {
      this.expanded[i] = true;
      this.sliced[i] = 10000;
    }
    else {
      this.expanded[i] = false;
      this.sliced[i] = 100;
    }

  }
}
