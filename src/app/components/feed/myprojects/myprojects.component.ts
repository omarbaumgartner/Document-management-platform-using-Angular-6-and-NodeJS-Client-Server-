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
  myprojects: Project;
  expanded: boolean = false;
  sliced: number = 100;
  points: string = "...";

  constructor(private authService: AuthService,
    private userService: UsersService,
    private managerService: ManagerService,
    public loadingService: LoadingService,
    private router: Router) {
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.getMyProjects()
  }

  getMyProjects() {
    this.session = this.authService.getPayload();
    console.log(this.session)
    this.managerService.getUserProjects(this.session.id)
      .subscribe(
        projects => {
          this.myprojects = projects;
          this.loadingService.isFinished();
          console.log(this.myprojects);
        }
      )
  }

  singleProject(id) {
    this.router.navigate(['/myprojects/' + id]);

  }

  translatemeArray(ids) {
    return this.userService.fromIdToUsername(ids, this.userService.users);

  }
  seeMore() {
    this.expanded = true;
    this.sliced = 1000;
    this.points = "";
  }
}
