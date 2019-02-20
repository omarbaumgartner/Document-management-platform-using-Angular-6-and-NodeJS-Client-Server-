import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Doc } from 'src/app/models/Doc.model';


const URL = 'http://localhost:8080/api/upload';

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})
export class FileuploaderComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/upload', itemAlias: 'photo' });
  filelist: { Files: any; };
  test: any;
  singlefile: any;
  fichiers: Doc[];


  constructor(private http: HttpClient) { }
  apiUrl = "http://localhost:8080";
  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      alert('File uploaded successfully');
    };
    this.getFiles();
  }

  showFiles() {
    this.getFiles()
      .subscribe((data: any) => this.filelist = data);
    if (this.filelist == undefined) {
      console.log("Loading ..")
    }
    else {
      this.test = this.filelist.Files;
      for (var i = 0; i < this.filelist.Files.length; i++) {
        this.fichiers[i] = this.filelist.Files[i];
        console.log(this.filelist.Files[i]);
      }

    }



  }


  getFiles() {
    return this.http.post<any>(`http://localhost:8080/api/docs/list`, {})

  }
}
