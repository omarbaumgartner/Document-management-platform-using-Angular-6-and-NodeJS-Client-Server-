import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Doc } from 'src/app/models/Doc.model';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-adddoc',
  templateUrl: './adddoc.component.html',
  styleUrls: ['./adddoc.component.css']
})
export class AdddocComponent implements OnInit {

  document = new Doc();
  documentForm: FormGroup;
  projectId: number;
  maxlength: number = 15;
  errormessage: string = "Filename need to be between 3 and 15 characters";
  error: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      filename: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxlength), Validators.pattern('.*\\S.*[a-zA-Z0-9]{1,15}')]]
    })
  }

  onSubmit() {
    this.document.filename = this.documentForm.get('filename').value;
    if (this.document.filename.length <= this.maxlength && this.document.filename.length > 3) {
      this.document.projectid = this.data.projectId;
      this.document.authorid = this.data.authorId;
      this.document.path = "";
      this.managerService.addDocument(this.document)
        .subscribe(result => {
          this.error = false;
          this.dialog.closeAll();
          //this.router.navigateByUrl('', { skipLocationChange: false }).then(() => this.router.navigate(["/myprojects/" + this.data.projectId]));

        });
    }
    else {
      this.error = true;
    }

  }

}
