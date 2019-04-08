import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';


const URL = 'http://localhost:8080/api/upload';
//const URL = 'http://52.58.225.205:8080/api/upload';

@Component({
  selector: 'app-uploaders',
  templateUrl: './uploaders.component.html',
  styleUrls: ['./uploaders.component.css']
})

export class UploadersComponent implements OnInit {

  /*   projectId: number = 2;
    userId: number = 1; */

  public uploader: FileUploader = new FileUploader({
    url: URL,
    additionalParameter: {
      projectId: this.data.projectId,
      userId: this.data.userId
    }
  });
  public hasBaseDropZoneOver: boolean = false;
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onErrorItem = (item: FileItem, response: any, status: any, headers: any) => {
      console.log('onErrorItem', item, response, status, headers);
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', headers);
      //alert('File uploaded successfully');
    };

  }


  test(item: FileItem) {
    console.log('this is the time', item)
    console.log(item)
    //this.uploader.uploadItem(item);
    this.uploader.uploadAll();
  }

}
