import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-singleproject',
  templateUrl: './singleproject.component.html',
  styleUrls: ['./singleproject.component.css']
})
export class SingleprojectComponent implements OnInit {

  project = new Project();
  session: any;
  editing: boolean = false;
  message: string;
  users: User[];
  members: Array<number> = [];
  selectedmembers: Array<number> = [];
  status: Array<boolean> = [false];
  role: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private authService: AuthService,
    private managerService: ManagerService,
    private userService: UsersService,
  ) {
    this.loadingService.isLoading();
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.managerService.getProjectById(id)
      .subscribe(project => {
        this.project = project
        this.members = this.project.members;
        var i;

        this.selectedmembers = this.project.members;
        for (i = 0; i < this.project.members.length; i++) {
          this.status[this.project.members[i]] = true;
        }

        this.loadingService.isFinished();
      });
    this.getUsers();
    this.role = this.authService.currentrole.value;
    this.session = this.userService.getPayload();


  }

  getUsers() {
    return this.userService.getUsers()
      .subscribe(
        users => {
          this.users = users
        }
      );
  }

  edit() {
    if (this.editing == false) {
      this.editing = true;
    }
    else
      this.editing = false;
  }

  update(): void {
    //this.submitted = true;
    this.managerService.updateProject(this.project)
      .subscribe(result => {
        this.edit();
        //this.message = "Projec Updated Successfully!";
      });
  }

  delete(): void {
    this.managerService.deleteProject(this.project.id)
      .subscribe(result => {
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects"]));
      });
  }

  finish() {
    if (this.project.finished == false) {
      this.project.finished = true;
      this.managerService.updateProject(this.project)
        .subscribe(result => {
          //this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects"]));
        });
    }
    else {
      this.project.finished = false;
      this.managerService.updateProject(this.project)
        .subscribe(result => {
          //this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects"]));
        });
    }


  }

  translatemeArray(ids) {
    if (ids != undefined) {
      return this.userService.fromIdToUsername(ids, this.userService.users);
    }
  }
  selectUser(user) {
    var y = 0;
    if (this.members.length == 1) {
      this.members[1] = user.id;
      this.status[user.id] = true;
    }
    else {
      for (var i = 1; i < this.members.length; i++) {
        if (user.id == this.members[i]) {
          i = this.members.length - 1;
          y++;
        }
      }
      if (y == 0) {
        this.members[this.members.length] = user.id;
        this.status[user.id] = true;
      }
    }
    this.project.members = this.members;
  }

  deselectUser(userId) {
    if (userId == this.project.creatorId) {

    }
    else {
      var y = 0;
      for (var i = 0; i < this.members.length; i++) {
        if (userId == this.members[i]) {
          this.status[this.members[i]] = false;
          this.members.splice(i, 1);
          i = this.members.length - 1;
          y++;
        }
      }
    }
    this.project.members = this.members;
    // console.log(this.project.members);
  }
}
