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
  projects: Project;
  currentprojects: Array<any>;
  resultContent: string;

  constructor(private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private search: SearchPipePipe) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      keyword: ['']
    })
  }

  onSubmit() {
    this.keywords = this.searchForm.get('keyword').value;
    if (this.keywords != "") {
      this.managerService.searchFor(this.keywords)
        .subscribe(result => {
          console.log(result);
          this.resultnumber = result.length;
          this.results = result;
          this.hasSearched = true;
          let i;
          for (i = 0; i < result.length; i++) {
            this.managerService.getProjectById(result[i].projectid).subscribe((project) => {
              // console.log(project);
              // console.log(project.id);
            })
          }
        }

        )
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
    return this.managerService.fromIdToProjectnames(id, this.managerService.projects);
  }

}
