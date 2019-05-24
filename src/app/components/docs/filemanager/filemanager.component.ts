import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Doc } from 'src/app/models/Doc.model';
import { DocsService } from 'src/app/services/docs/docs.service';
import { Router } from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { NotifService } from 'src/app/services/notifications/notif.service';
import { MatDialog } from '@angular/material';
import { FileFilterPipe } from 'src/app/pipes/file-filter.pipe';



@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css'],
  providers: [FileFilterPipe]
})
export class FilemanagerComponent implements OnInit {

  docs: Doc[];
  users: User[];
  subscription: any;
  projects: import("/home/omar/Desktop/WebClient V2/src/app/models/Project.model").Project[];


  constructor(private docsService: DocsService,
    private router: Router,
    private loadingService: LoadingService,
    private userService: UsersService,
    private managerService: ManagerService,
    private notifService: NotifService,
    public dialog: MatDialog
  ) {
    this.userService.reloadUsers();
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.subscription = this.managerService.observableProjects
      .subscribe(projects => {
        this.projects = projects;
      })

    this.getDocs();

    this.subscription = this.userService.observablePeople
      .subscribe(users => {
        this.users = users;
      })
  }

  getDocs() {
    return this.managerService.getDocs()
      .subscribe(
        docs => {
          this.docs = docs;
          this.loadingService.isFinished();
        }
      );
  }

  viewDocument(document: Doc) {
    var i;
    var recentId = document.versions[0];
    for (i = 0; i < document.versions.length; i++) {
      if (recentId < document.versions[i]) {
        recentId = document.versions[i];
      }
    }
    console.log(document.versions)
    console.log(recentId);
    //this.router.navigate(['/docs/' + recentId]);

  }

  translatemeArray(ids) {
    if (ids != undefined) {
      return this.userService.fromIdToUsername(ids, this.users);
    }
  }

  translatemeArray2(id) {
    return this.managerService.fromIdToProjectnames(id, this.projects);
  }

  deleteDoc(document: Doc) {
    this.managerService.deleteDocument(document)
      .subscribe((val) => {
        this.ngOnInit();
      })
  }

  navigateToUser(id: number) {
    this.router.navigate(['/users/' + id]);
  }

  navigateToProject(id: number) {
    this.router.navigate(['/myprojects/' + id]);

  }
  navigatoToDocument(id : number) {
    this.router.navigate(['/docs/'])
  }

}
