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
  userData = new Array<Array<string | number>>();
  showUsers: boolean;


  projectTitle = "Projects regarding members"
  projectType = "BarChart";
  projectData = new Array<Array<string | number>>();
  projectColumns = ['', 'Members'];
  showProjects: boolean;


  fileTitle = "Files regarding their status"
  fileType = "PieChart"
  fileData = new Array<Array<string | number>>();

  fileColumns = ['', 'Number'];

  myOptions = {
    is3D: true
  };
  dynamicResize = true;



  subscription: any;
  showFiles: boolean;

  constructor(private managerService: ManagerService,
    private userService: UsersService,
    public loadingService: LoadingService) {
    //this.loadingService.isLoading();
    this.showProjects = false;
    this.showFiles = false;
    this.showUsers = false;
    this.userService.reloadUsers();
    this.managerService.reloadProjects();
    this.manageProjects();
    this.manageUsers();
    this.manageFiles();

  }

  ngOnInit() {

    this.subscription = this.managerService.observableProjects
      .subscribe(projects => {
        this.projects = projects;

      })
    this.subscription = this.userService.observablePeople
      .subscribe(users => {
        this.users = users;

      })
  }

  translatemeArray(ids) {
    return this.userService.fromIdToUsername(ids, this.users);
  }

  manageUsers() {
    this.userService.getUsers()
      .subscribe((users) => {
        let i;
        let currentRoles = new Array<string>();
        let currentNumbers = new Array<number>();
        currentRoles[0] = users[0].role;
        currentNumbers[0] = 1;
        for (i = 1; i < users.length; i++) {
          if (currentRoles.includes(users[i].role) === false) {
            let a = currentRoles.push(users[i].role);
            currentNumbers[a - 1] = 1;
          }
          else {
            let y = 0;
            while (y < currentRoles.length) {
              if (users[i].role == currentRoles[y])
                currentNumbers[y]++;
              y++;
            }
          }
        }
        for (i = 0; i < currentRoles.length; i++) {
          this.userData[i] = [currentRoles[i], currentNumbers[i]];
        }
        this.showUsers = true;
      })
  }

  manageProjects() {
    this.managerService.getProjects()
      .subscribe((projects) => {
        let currentNames = new Array<string>();
        let currentNumbers = new Array<number>();
        let i;
        currentNames[0] = projects[0].name;
        currentNumbers[0] = 1;
        for (i = 1; i < projects.length; i++) {
          if (currentNames.includes(projects[i].name) === false) {
            let a = currentNames.push(projects[i].name);
            currentNumbers[a - 1] = projects[i].members.length;
          }
          else {
            let y = 0;
            while (y < currentNames.length) {
              if (projects[i].name == currentNames[y])
                currentNumbers[y] = projects[i].members.length;
              y++;
            }
          }
        }
        for (i = 0; i < currentNames.length; i++) {
          this.projectData[i] = [currentNames[i], currentNumbers[i]];
        }
        this.showProjects = true;
      })
  }

  manageFiles() {
    this.managerService.getDocs()
      .subscribe((docs) => {
        let currentStatus = ["Draft", "Emitted", "Validated", "Published"];
        let currentNumbers = [0, 0, 0, 0]
        let i;
        for (i = 0; i < docs.length; i++) {
          let emitted = docs[i].emitted;
          let validated = docs[i].validated;
          let published = docs[i].published;
          if (emitted != true) {
            currentNumbers[0]++;
          }
          else if (validated != true) {
            currentNumbers[1]++;
          }
          else if (published != true) {
            currentNumbers[2]++;

          }
          else {
            currentNumbers[3]++;

          }
        }
        for (i = 0; i < currentStatus.length; i++) {
          this.fileData[i] = [currentStatus[i], currentNumbers[i]];
        }
        this.showFiles = true;
      })
  }

  test() {
    console.log("test")
  }
}
