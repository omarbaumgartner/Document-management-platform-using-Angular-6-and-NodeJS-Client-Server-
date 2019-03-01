import { Component, OnInit } from '@angular/core';
import { Doc } from 'src/app/models/Doc.model';
import { DocsService } from 'src/app/services/docs/docs.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {

  docs: Doc[];

  constructor(private docsService: DocsService,
    private router: Router) { }

  ngOnInit() {
    this.getDocs();
  }

  getDocs() {
    return this.docsService.getDocs()
      .subscribe(
        docs => {
          this.docs = docs
        }
      );
  }

  viewDoc(id: any) {
    this.router.navigate(['/docs/' + id]);
  }

}
