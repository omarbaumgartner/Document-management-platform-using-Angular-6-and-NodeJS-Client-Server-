import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Project } from 'src/app/models/Project.model';
import { LoadingService } from 'src/app/services/loading.service';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
declare let google: any;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})


export class FeedComponent implements OnInit {
  projects: Project[];
  users: Array<User>;
  userTitle = "Users regarding the roles"
  userType = "PieChart";
  userData = [
    ['Reviewer', 3],
    ['Rédacteur/Propriétaire', 4],
    ['Project Manager', 2],
    ['QA Manager', 1],
    ['Administrateur', 2]
  ]

  projectTitle = "Projects Overview"
  projectType = "BarChart";
  projectData = [
    ['AI Taxi Project', 3],
    ['Design Project', 4],
    ['AI Calculator Project', 2],
  ]
  projectColumns = ['', 'Members'];

  fileTitle = "Files Overview"
  fileType = "LineChart"
  fileData = [
    ['January', 0],
    ['February', 12],
    ['March', 20],
    ['April', 14],
    ['June', 25]
  ]
  fileColumns = ['', 'Number'];

  myOptions = {
    is3D: true
  };
  dynamicResize = true;



  subscription: any;

  constructor(private managerService: ManagerService,
    private userService: UsersService,
    public loadingService: LoadingService) {
    //this.loadingService.isLoading();
    this.managerService.reloadProjects();
    this.userService.reloadUsers();


  }

  ngOnInit() {
    this.subscription = this.managerService.observableProjects
      .subscribe(projects => {
        this.projects = projects;

      })

    this.subscription = this.userService.observablePeople
      .subscribe(users => {
        this.users = users;
        //this.loadingService.isFinished();

      })
  }

  translatemeArray(ids) {
    return this.userService.fromIdToUsername(ids, this.users);

  }

  test() {
    this.userService.getUsers();
    console.log(this.users);
    console.log(this.projects);
  }
}
