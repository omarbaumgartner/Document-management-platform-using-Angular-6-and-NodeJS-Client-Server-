import { Component, OnInit } from '@angular/core';
import { Cont } from 'src/app/models/Cont.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Doc } from 'src/app/models/Doc.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-singledoc',
  templateUrl: './singledoc.component.html',
  styleUrls: ['./singledoc.component.css']
})
export class SingledocComponent implements OnInit {
  public Editor = ClassicEditor;
  cont = new Cont();
  document = new Doc();
  isEditing: boolean = false;
  role: any;
  versions: Array<number>;
  contentId: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private location: Location) {
    this.loadingService.isLoading();


  }

  ngOnInit() {
    this.contentId = +this.route.snapshot.paramMap.get('id');
    this.managerService.getDocumentById(this.contentId)
      .subscribe(content => {
        this.cont = content;
        this.managerService.getSingleDocument(this.cont.documentid)
          .subscribe(document => {
            this.document = document;
            this.versions = document.versions;
            console.log(this.versions);
            this.loadingService.isFinished();
          })

      })


    this.role = this.authService.currentrole.value;

  }

  newVersion() {
    this.document.path = this.cont.content;
    this.managerService.newDocVersion(this.document)
      .subscribe(newcontent => {
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/docs/" + newcontent]));
      })

  }

  viewVersion(id) {
    this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/docs/" + id]));

  }

  updateContent() {
    this.managerService.updateContent(this.cont)
      .subscribe((val) => {
        this.isEditing = false;
        window.scroll(0, 0);
      })
  }


  updateFile(document): void {
    //this.submitted = true;
    this.managerService.updateDocument(document)
      .subscribe(result => {
        console.log(result);
        //this.message = "Projec Updated Successfully!";
      });
  }

  deleteFile(id): void {
    this.managerService.deleteDocument(id)
      .subscribe(result => {
        this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/myprojects/" + this.document.projectid]));

      });
  }

  edit() {
    if (this.isEditing == false)
      this.isEditing = true;
    else {
      this.isEditing = false;
      window.scroll(0, 0);
    }
  }

  back() {
    this.router.navigate(['/myprojects/' + this.document.projectid]);
  }
  captureScreen() {
    let doc = new jspdf();
    var data = this.cont.content;
    doc.fromHTML(data);
    //doc.text(data, 10, 10);
    doc.save(this.document.filename)

  }

}
