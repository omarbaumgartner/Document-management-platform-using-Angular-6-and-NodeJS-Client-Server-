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
import { UsersService } from 'src/app/services/users/users.service';
import { OngoingPipe } from 'src/app/pipes/ongoing.pipe';

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
  textarea: string = "";
  modifySugs: Array<boolean> = [false];
  showedComments: Array<boolean> = [false];
  exampleNumber: number = 2;
  errmsg: string;
  errstatus: boolean;
  cancelEditTerm: string;


  constructor(private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private router: Router,
    private managerService: ManagerService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private userService: UsersService,
    private docService: DocsService,
    private location: Location) {
    this.loadingService.isLoading();

    this.session = this.getPayload();
    setInterval(() => {
      if (this.isEditing == true) {
        this.autoSave();
        //console.log("Interval : Auto saving")
      }
    }, 1000 * 60);

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
    //var splitTitle = doc.splitTextToSize(this.cont.content, 180);
    // doc.fromHTML(data, 15, 20);
    //doc.text(15, 20, splitTitle);
    //doc.text(data, 10, 10);
    doc.fromHTML(data, 15, 15, {
      'width': 180, // max width of content on PDF
    })
    doc.save(this.document.filename)
  }

  //Suggestion Part

  getSuggestions() {
    this.docService.getSuggestions(this.document.id)
      .subscribe((sugs) => {
        this.suggestions = sugs;
      })
  }

  submitSuggestion() {
    this.submittedSug = true;
    this.suggestion.authorId = this.session.id;
    this.suggestion.documentId = this.document.id;
    this.suggestion.content = this.sugForm.get('content').value;
    if (this.suggestion.content == "") {
      this.errstatus = true;
      this.errmsg = "You can't send an empty suggestion";
    }
    else {
      this.docService.addSuggestion(this.suggestion)
        .subscribe(result => {
          this.suggestions = null;
          this.getSuggestions();
        });
      this.textarea = "";
      this.errstatus = false;
    }


  }

  modifySuggestion(suggestion: Sug): void {
    //console.log(suggestion)
    if (suggestion.content == "") {

    }
    else {
      this.docService.updateSuggestion(suggestion)
        .subscribe(result => {
          //console.log(result)

          //this.suggestions = null;
          //console.log(this.suggestions)
          this.ngOnInit();
          console.log(this.suggestions)
          this.isModifySug(suggestion.id);

        });
    }

  }

  deleteSuggestion(id: number) {
    this.docService.deleteSuggestion(id)
      .subscribe(result => {
        this.suggestions = null;
        this.ngOnInit();
      });

  }

  translatemeArray(ids) {
    if (ids != undefined) {
      return this.userService.fromIdToUsername(ids, this.userService.observablePeople.value);
    }
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

  isModifySug(id: number) {
    if (this.modifySugs[id] == undefined)
      this.modifySugs[id] = true;
    else if (this.modifySugs[id] == false)
      this.modifySugs[id] = true
    else
      this.modifySugs[id] = false
  }

  hasOpenedComments(id: number) {
    if (this.showedComments[id] == undefined)
      this.showedComments[id] = true;
    else if (this.showedComments[id] == false)
      this.showedComments[id] = true
    else
      this.showedComments[id] = false
  }

  Emit() {
    if (this.document.emitted == true) {
      this.document.emitted = false;

    }
    else
      this.document.emitted = true;
    this.managerService.updateDocument(this.document)
      .subscribe((val) => {
        console.log(val)
      })
  }

  Validate() {
    if (this.document.validated == true) {
      this.document.validated = false;

    }
    else
      this.document.validated = true;
    this.managerService.updateDocument(this.document)
      .subscribe((val) => {
        console.log(val)
      })
  }

  Publish() {
    if (this.document.published == true) {
      this.document.published = false;

    }
    else
      this.document.published = true;
    this.managerService.updateDocument(this.document)
      .subscribe((val) => {
        console.log(val)
      })
    /*       .subscribe((val) => {
            this.managerService.getSingleDocument(this.cont.documentid)
              .subscribe(document => {
                this.document = document;
                this.versions = document.versions;
              })
          }) */
  }

}
