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
import { MatSnackBar } from '@angular/material';
import { Com } from 'src/app/models/Com.model';

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
  submittedSug: boolean;
  textarea: string = "";
  exampleNumber: number = 2;
  errmsg: string;
  errstatus: boolean;
  cancelEditTerm: string;
  newcontentid: Doc;
  increasing: boolean;

  suggestions: Sug[];
  sugForm: any;
  sugnumber: number;
  modifySugs: Array<boolean> = [false];


  comForm: any;
  comment = new Com();
  comments: Com[];
  comnumber: Array<number> = [];
  modifyComs: Array<boolean> = [false];
  showedComments: Array<boolean> = [false];
  sugIds: Array<number> = [0];



  constructor(private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private router: Router,
    private managerService: ManagerService,
    private snackBar: MatSnackBar,
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
        this.snackBar.open("Autosaving ..", "", {
          duration: 2500,
          verticalPosition: "bottom",
        });
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
          })
      },
        () => {

        },
        () => {
          this.loadingService.isFinished();
        })

    this.sugForm = this.formBuilder.group({
      authorId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9]{1,15}')]],
      documentId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9_.]{1,15}')]],
      content: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    });

    this.comForm = this.formBuilder.group({
      authorId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9]{1,15}')]],
      suggestionId: ["", [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9_.]{1,15}')]],
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
        this.newcontentid = newcontent;
        this.snackBar.open("New version has been created", "Close", {
          duration: 3000,
          verticalPosition: "bottom",
        });
      },
        () => { },
        () => {
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/docs/" + this.newcontentid]));
        })
  }

  viewVersion(id) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/docs/" + id]));
  }

  updateDocumentContent() {
    this.managerService.updateContent(this.cont)
      .subscribe((val) => {
        this.isEditing = false;
        window.scroll(0, 0);
      },
        () => { }, () => {
          this.snackBar.open("Document has been saved", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
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
        this.snackBar.open("Document has been saved", "Close", {
          duration: 3000,
          verticalPosition: "bottom",
        });
      },
        () => { },
        () => {
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects/" + this.document.projectid]));
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
        this.sugnumber = this.suggestions.length;
        this.getComments();
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
        },
          () => { },
          () => {
            this.getSuggestions();
            this.snackBar.open("Suggestion has been submitted", "Close", {
              duration: 3000,
              verticalPosition: "bottom",
            });
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
          //console.log(this.suggestions)

          this.ngOnInit();
          this.isModifySug(suggestion.id);

        }, () => { }, () => {
          this.snackBar.open("Suggestion has been updated", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        });
    }

  }

  deleteSuggestion(id: number) {
    this.docService.deleteSuggestion(id)
      .subscribe(result => {
        this.suggestions = null;
        this.ngOnInit();
      },
        () => { },
        () => {
          this.snackBar.open("Suggestion has been deleted", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        });

  }

  //Comment Part

  getComments() {
    this.docService.getComments(this.document.id)
      .subscribe((comments) => {
        this.comments = comments;
        for (let i = 0; i < this.suggestions.length; i++) {
          this.comnumber[this.suggestions[i].id] = 0;
        }
        console.log(this.comnumber);
        for (let i = 0; i < this.suggestions.length; i++) {
          for (let y = 0; y < this.comments.length; y++) {
            if (this.suggestions[i].id == this.comments[y].suggestionid) {
              this.comnumber[this.suggestions[i].id]++;
            }
          }
        }
        console.log(this.comnumber);

      })
  }

  submitComment(id: number) {
    console.log("submitted")
    this.comment.authorId = this.session.id;
    this.comment.suggestionid = id;
    this.comment.documentid = this.document.id;
    this.comment.content = this.comForm.get('content').value;
    if (this.comment.content == "") {
      this.errstatus = true;
      this.errmsg = "You can't send an empty comment";
      console.log("Empty")
    }
    else {
      this.docService.addComment(this.comment)
        .subscribe(result => {
          this.comments = null;
        },
          () => { },
          () => {
            this.getComments();
            this.snackBar.open("Comment has been submitted", "Close", {
              duration: 3000,
              verticalPosition: "bottom",
            });
          });
      this.textarea = "";
      this.errstatus = false;
    }


  }

  modifyComment(comment: Com): void {
    //console.log(suggestion)
    if (comment.content == "") {

    }
    else {
      this.docService.updateComment(comment)
        .subscribe(result => {
          //console.log(result)
          //this.suggestions = null;
          //console.log(this.suggestions)
          //console.log(this.suggestions)

          this.ngOnInit();
          this.isModifyCom(comment.id);

        }, () => { }, () => {
          this.snackBar.open("Suggestion has been updated", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        });
    }

  }

  deleteComment(id: number) {
    this.docService.deleteComment(id)
      .subscribe(result => {
        this.comments = null;
        this.ngOnInit();
      },
        () => { },
        () => {
          this.snackBar.open("Suggestion has been deleted", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        });

  }

  test() {
    console.log(this.comnumber);
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

  isModifyCom(id: number) {
    if (this.modifyComs[id] == undefined)
      this.modifyComs[id] = true;
    else if (this.modifyComs[id] == false)
      this.modifyComs[id] = true
    else
      this.modifyComs[id] = false
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
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been set to not emitted", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
    else {
      this.document.emitted = true;
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been emitted", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
  }

  Validate() {
    if (this.document.validated == true) {
      this.document.validated = false;
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been set to not validated", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
    else {
      this.document.validated = true;
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been validated", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
  }

  Publish() {
    if (this.document.published == true) {
      this.document.published = false;
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been set to not published", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
    else {
      this.document.published = true;
      this.managerService.updateDocument(this.document)
        .subscribe((val) => {
          this.snackBar.open("Document has been published", "Close", {
            duration: 3000,
            verticalPosition: "bottom",
          });
        })
    }
  }

  get sortData() {
    if (this.suggestions) {
      return this.suggestions.sort((a, b) => {
        if (this.increasing == true || null)
          return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
        else
          return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
      });
    }
    else {
      return null;
    }
  }

  sortSug() {
    if (this.increasing === true || this.increasing === null) {
      this.increasing = false;
    }
    else {
      this.increasing = true;
    }
  }

}
