import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';
import { Doc } from 'src/app/models/Doc.model';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { AdddocComponent } from '../../docs/adddoc/adddoc.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';

@Component({
  selector: 'app-singleproject',
  templateUrl: './singleproject.component.html',
  styleUrls: ['./singleproject.component.css'],
  providers: [FilterPipe]

})
export class SingleprojectComponent implements OnInit {

  project = new Project();
  document = new Doc();
  session: any;
  editing: boolean = false;
  isRenaming: Array<boolean> = [false];
  message: string;
  documents: Doc;
  users: User[];
  members: Array<number> = [];
  selectedmembers: Array<number> = [];
  status: Array<boolean> = [false];
  role: any;
  projectId: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private authService: AuthService,
    private managerService: ManagerService,
    private userService: UsersService,
    public dialog: MatDialog,
    private location: Location,
  ) {
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.projectId = +this.route.snapshot.paramMap.get('id');
    this.managerService.getProjectById(this.projectId)
      .subscribe(project => {
        this.project = project;
        this.members = this.project.members;
        var i;

        this.selectedmembers = this.project.members;
        for (i = 0; i < this.project.members.length; i++) {
          this.status[this.project.members[i]] = true;
        }
        this.managerService.getDocuments(this.projectId)
          .subscribe(document => {
            this.documents = document;
            //console.log(this.document);
            this.loadingService.isFinished();

          })
      });
    this.getUsers();
    this.role = this.authService.currentrole.value;
    this.session = this.userService.getPayload();



  }

  viewDocument(document: any) {
    var i;
    var recentId = document.versions[0];
    for (i = 0; i < document.versions.length; i++) {
      if (recentId < document.versions[i]) {
        recentId = document.versions[i];
      }
    }
    console.log(recentId);
    this.router.navigate(['/docs/' + recentId]);

  }

  getUsers() {
    return this.userService.getUsers()
      .subscribe(
        users => {
          this.users = users
        }
      );
  }

  addFile(): void {
    const dialogRef = this.dialog.open(AdddocComponent, {
      autoFocus: true,
      data: {
        projectId: this.projectId,
        authorId: this.session.id,
      }
    }).afterClosed().subscribe((val) => {
      this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/myprojects/" + this.projectId]));
    });
  }

  updateFile(document): void {
    //this.submitted = true;
    this.managerService.updateDocument(document)
      .subscribe(result => {
        this.isRenaming[document.id] = false;
        //this.message = "Projec Updated Successfully!";
      });
  }

  deleteFile(id): void {
    this.managerService.deleteDocument(id)
      .subscribe(result => {
        this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/myprojects/" + this.projectId]));

      });
  }

  edit() {
    if (this.editing == false) {
      this.editing = true;
    }
    else
      this.editing = false;
  }

  rename(id) {
    this.isRenaming[id] = true;
  }

  updateProject(): void {
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
        this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/home"]));
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

  goBack(): void {
    //this.router.navigate(['/myprojects']);
    this.location.back();

  }
}
