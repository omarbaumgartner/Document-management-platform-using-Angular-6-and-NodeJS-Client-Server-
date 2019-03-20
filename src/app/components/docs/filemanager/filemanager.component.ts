import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Doc } from 'src/app/models/Doc.model';
import { DocsService } from 'src/app/services/docs/docs.service';
import { Router } from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from 'src/app/services/loading.service';



@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {

  docs: Doc[];

  constructor(private docsService: DocsService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.loadingService.isLoading();
  }

  ngOnInit() {
    this.getDocs();
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

  viewDoc(id: any) {
    this.router.navigate(['/docs/' + id]);
  }

}
