import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Doc } from 'src/app/models/Doc.model';
import { DocsService } from 'src/app/services/docs/docs.service';
import { Router } from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/User.model';



@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {

  docs: Doc[];
  users: User[];
  subscription: any;


  constructor(private docsService: DocsService,
    private router: Router,
    private loadingService: LoadingService,
    private userService: UsersService,
  ) {
    this.userService.reloadUsers();
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.getDocs();
    this.subscription = this.userService.observablePeople
      .subscribe(users => {
        this.users = users;
      })
  }

  getDocs() {
    return this.docsService.getDocs()
      .subscribe(
        docs => {
          this.docs = docs;
          this.loadingService.isFinished();
        }
      );
  }

  viewDocument(document: any) {
    var i;
    var recentId = document.versions[0];
    for (i = 0; i < document.versions.length; i++) {
      if (recentId < document.versions[i]) {
        recentId = document.versions[i];
      }
    }
    this.router.navigate(['/docs/' + recentId]);

  }

  translatemeArray(ids) {
    if (ids != undefined) {
      return this.userService.fromIdToUsername(ids, this.users);
    }
  }

}
