import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Doc } from 'src/app/models/Doc.model';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/Project.model';
import { SearchPipePipe } from 'src/app/pipes/search-pipe.pipe';

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
  results: Doc;
  projects: Project[];
  currentprojects: Array<any>;
  resultContent: string;
  term: string;
  subscription: any;


  constructor(private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private search: SearchPipePipe) {
    this.managerService.reloadProjects();
  }

  ngOnInit() {
    this.subscription = this.managerService.observableProjects
      .subscribe(projects => {
        this.projects = projects;

      })
    this.searchForm = this.formBuilder.group({
      keyword: ['']
    })
    this.term = this.managerService.searchTerm;
    this.keywords = this.managerService.searchTerm;
    this.hasSearched = this.managerService.hasSearched;
    this.results = this.managerService.results;
    this.resultnumber = this.managerService.resultnumber;
  }

  onSubmit() {
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
  }

  viewDocc(id: number) {
    this.router.navigate(['/docs/' + id]);
  }

  singleProject(id) {
    this.router.navigate(['/myprojects/' + id]);
  }


  translatemeArray(id) {
    return this.managerService.fromIdToProjectnames(id, this.projects);
  }

  testbutton() {
    this.term = this.managerService.searchTerm;
    console.log(this.term);
  }
}
