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
import * as jwt_decode from "jwt-decode";
import { Sug } from 'src/app/models/Sug.model';
import { FormBuilder, Validators } from '@angular/forms';
import { DocsService } from 'src/app/services/docs/docs.service';

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
  autosaving: boolean = false;
  userToken: any;
  session: any;
  suggestion = new Sug();
  sugForm: any;
  submittedSug: boolean;
  suggestions: Sug;

  constructor(private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private router: Router,
    private managerService: ManagerService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private docService: DocsService,
    private location: Location) {
    this.loadingService.isLoading();

    this.session = this.getPayload();
    setInterval(() => {
      if (this.isEditing == true) {
        this.autoSave();
        console.log("Auto saving")
      }
    }, 1000 * 60);


  }

  ngOnInit() {
    this.contentId = +this.route.snapshot.paramMap.get('id');
    this.managerService.getDocumentById(this.contentId)
      .subscribe(content => {
        console.log(this.contentId)
        this.cont = content;
        console.log(content);
        console.log("yes");
        this.managerService.getSingleDocument(this.cont.documentid)
          .subscribe(document => {
            this.document = document;
            this.versions = document.versions;
            console.log(this.versions);
            this.getSuggestions();
            this.loadingService.isFinished();
          })

      })
    this.sugForm = this.formBuilder.group({
      authorId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9]{1,15}')]],
      documentId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9_.]{1,15}')]],
      content: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    });


    this.role = this.authService.currentrole.value;

  }
  getPayload() {
    if (localStorage.getItem('currentUser')) {
      this.userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      console.log("User Token : " + this.userToken);
      return jwt_decode(this.userToken);
    }
    else
      return undefined;
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

  updateDocumentContent() {
    this.managerService.updateContent(this.cont)
      .subscribe((val) => {
        this.isEditing = false;
        window.scroll(0, 0);
      })
  }

  autoSave() {
    this.autosaving = true;
    this.managerService.updateContent(this.cont)
      .subscribe((val) => {
        setTimeout(() => { this.autosaving = false }, 3000);
      })
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

  //Export as PDF
  captureScreen() {
    let doc = new jspdf();
    var data = this.cont.content;
    doc.fromHTML(data);
    //doc.text(data, 10, 10);
    doc.save(this.document.filename)

  }

  //Suggestion Part

  getSuggestions() {
    this.docService.getSuggestions(this.document.id)
      .subscribe((sugs) => {
        this.suggestions = sugs;
        console.log(this.suggestions)
      })
  }

  submitSuggestion() {
    this.submittedSug = true;
    this.suggestion.authorId = this.session.id;
    this.suggestion.documentId = this.document.id;
    this.suggestion.content = this.sugForm.get('content').value;
    console.log(this.suggestion);
    this.docService.addSuggestion(this.suggestion)
      .subscribe(result => {
        this.getSuggestions();
      });
  }

  modifySuggestion(suggestion): void {
    this.docService.updateSuggestion(suggestion)
      .subscribe(result => {

      });
  }

  deleteSuggestion(id: number) {
    this.docService.deleteSuggestion(id)
      .subscribe(result => {

      });
  }


}
