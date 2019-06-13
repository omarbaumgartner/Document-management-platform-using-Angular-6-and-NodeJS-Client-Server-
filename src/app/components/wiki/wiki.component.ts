import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Doc } from 'src/app/models/Doc.model';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/Project.model';
import { SearchPipePipe } from 'src/app/pipes/search-pipe.pipe';
import { NotifService } from 'src/app/services/notifications/notif.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css'],
  providers: [SearchPipePipe]
})

export class WikiComponent implements OnInit {
  hasSearched: boolean;
  keywords: string;
  resultnumber: number;
  searchForm: FormGroup;
  results: any[];
  abracadabra: Doc[] = new Array<Doc>();
  projects: Project[];
  currentprojects: Array<any>;
  resultContent: string;
  term: string;
  subscription: any;
  session: any;
  dateSort: boolean = null;
  increasing: boolean = null;
  noError: boolean = false;
  expanded = new Array<boolean>(false);
  docs: Doc[];

  constructor(private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingService: LoadingService,
    private authService: AuthService) {
    this.managerService.reloadProjects();

  }

  ngOnInit() {

    this.session = this.authService.getPayload();
    this.subscription = this.managerService.observableProjects
      .subscribe(projects => {
        this.projects = projects;
      })
    this.subscription = this.managerService.observableDocs
      .subscribe(docs => {
        this.docs = docs;
      })

    this.searchForm = this.formBuilder.group({
      keyword: ['']
    })
    this.term = this.managerService.searchTerm;
    this.keywords = this.managerService.searchTerm;
    this.hasSearched = this.managerService.hasSearched;
    this.results = this.managerService.results;
    this.resultnumber = this.managerService.resultnumber;
    this.abracadabra = this.managerService.abracadabra;
  }

  onRestrictedSubmit() {
    this.managerService.reloadProjects();
    this.managerService.reloadDocuments();
    this.keywords = this.searchForm.get('keyword').value;
    if (this.keywords.includes("/") == true || this.keywords.includes("\\") == true) {
      this.noError = true;
      this.hasSearched = false;
    }
    else {
      this.noError = false;
      let searchTerm = this.keywords + "+" + this.session.id;
      if (this.keywords != "" || this.keywords.match(/[a-z]/i) || this.keywords != null || this.keywords != undefined) {
        //If not admin
        if (this.session.role != "Administrateur") {
          this.managerService.restrictedSearchFor(searchTerm)
            .subscribe(result => {
              if (result == false) {
                this.resultnumber = 0;
                this.results = null;
                this.hasSearched = true;
              }
              else {
                this.resultnumber = result.length;
                if (this.resultnumber != 0) {
                  this.test();
                  this.results = result;
                }
                else {
                  this.results = null;
                }
                this.hasSearched = true;
              }

            })
        }
        //If admin
        else {
          this.managerService.searchFor(this.keywords)
            .subscribe(result => {
              this.resultnumber = result.length;
              if (this.resultnumber != 0) {
                this.results = result;
                this.test();
              }
              else {
                this.results = null;
                this.abracadabra = [];

              }
              this.hasSearched = true;
            })
        }
      }
      else {
        this.results = null;
        this.abracadabra = null;
        this.resultnumber = 0;
      }
    }
    console.log(this.results);
    console.log(this.abracadabra);
    console.log(this.resultnumber);
  }

  viewDocc(id: number) {
    this.router.navigate(['/docs/' + id]);
  }

  singleProject(id: any) {
    this.router.navigate(['/myprojects/' + id]);
  }

  translatemeArray(id) {
    return this.managerService.fromIdToProjectnames(id, this.projects);
  }

  get sortData() {
    if (this.results) {
      return this.results.sort((a, b) => {
        if (this.dateSort == true) {
          if (this.increasing == true || null)
            return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
          else
            return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
        }
        else if (this.dateSort == false) {
          if (this.increasing == true || null)
            return b.filename > a.filename ? -1 : 1;
          else
            return b.filename > a.filename ? 1 : -1;
        }
        else
          return;
      });
    }
    else {
      return null;
    }
  }

  get sortData2() {
    if (this.abracadabra) {
      return this.abracadabra.sort((a, b) => {
        if (this.dateSort == true) {
          if (this.increasing == true || null)
            return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
          else
            return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
        }
        else if (this.dateSort == false) {
          if (this.increasing == true || null)
            return b.filename > a.filename ? -1 : 1;
          else
            return b.filename > a.filename ? 1 : -1;
        }
        else
          return;
      });
    }
    else {
      return null;
    }
  }

  expand(id: number) {
    if (this.expanded[id] == null)
      this.expanded[id] = true;
    else
      this.expanded[id] = null;
  }

  test2() {
    console.log(this.abracadabra);
  }

  /*   onSubmit() {
      console.log("session : ", this.session);
      this.keywords = this.searchForm.get('keyword').value;
      if (this.keywords != "") {
        this.managerService.searchFor(this.keywords)
          .subscribe(result => {
            this.resultnumber = result.length;
            this.results = result;
            this.hasSearched = true;
          })
      }
      else {
  
        this.results = null;
        this.resultnumber = 0;
      }
    } */

  test() {
    this.session = this.authService.getPayload();
    let i;
    let filenames = new Array<any>();
    let ids = new Array<any>();
    filenames[0] = this.results[0].documentid;
    ids[0] = 0;
    for (i = 0; i < this.results.length; i++) {
      if (filenames.includes(this.results[i].documentid) == false) {
        filenames.push(this.results[i].documentid);
        ids.push(i);
      }
    }
    for (i = 0; i < ids.length; i++) {
      let temporaryContent = this.results[i].content;
      this.results[i].content = new Array<any>();
      this.results[i].content.push(temporaryContent);
      for (let j = ids.length; j < this.results.length; j++) {
        if (this.results[i].documentid == this.results[j].documentid) {
          this.results[i].content.push(this.results[j].content);
        }
      }

    }
    for (i = 0; i < ids.length; i++) {
      this.abracadabra[i] = this.results[i];
    }
    this.resultnumber = this.abracadabra.length;
  }

  translateTime(creationTime: string) {
    let word: string[];
    let date: string[];
    let anotherDate: string[];
    let time: string[];
    word = creationTime.split("T");
    date = word;
    time = word[1].split(".");
    anotherDate = date[0].split("-");
    let finalDate = anotherDate[2] + "-" + anotherDate[1] + "-" + anotherDate[0];
    let finalTime = time[0];
    let finalReturn = finalDate + " at " + finalTime;
    return finalReturn;
  }

  sortByDate() {
    this.dateSort = true;
    if (this.increasing == null) {
      this.increasing = true;
    }
    else if (this.increasing == true) {
      this.increasing = false;
    }
    else
      this.increasing = true;
  }

  sortByName() {
    this.dateSort = false;
    if (this.increasing == null) {
      this.increasing = true;
    }
    else if (this.increasing == true) {
      this.increasing = false;
    }
    else
      this.increasing = true;
  }


}
