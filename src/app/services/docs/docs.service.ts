import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/models/Doc.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private docsUrl = 'http://localhost:8080/api/db/docs';  // URL to web api

  docs: Doc[];

  paths: string[] = ['./myuploads/folder1/myfile.txt', ' ./myuploads/secondfile.txt', './myuploads/folder2/test.json', './myuploads/firstfile_1551443020378.txt', './myuploads/folder2/Georgia.doc', './myuploads/folder2/folder1/imrtemplate.doc'];

  folders: string[];

  constructor(private http: HttpClient) { }

  getDocs(): Observable<Doc[]> {
    return this.http.get<Doc[]>(this.docsUrl)
  }

  getDocById(id: number): Observable<Doc> {
    const url = `${this.docsUrl + "/id"}/${id}`;
    return this.http.get<Doc>(url);
  }

  addDoc(doc: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.docsUrl, doc, httpOptions);
  }

  deleteUser(doc: Doc | number): Observable<Doc> {
    const id = typeof doc === 'number' ? doc : doc.id;
    const url = `${this.docsUrl}/${id}`;

    return this.http.delete<Doc>(url, httpOptions);
  }

  updateDoc(doc: Doc): Observable<any> {
    return this.http.put(this.docsUrl, doc, httpOptions);

  }

  ordganize() {
    var i;
    return this.getDocs()
      .subscribe(
        docs => {
          this.docs = docs
          let folders;
          let files;
          for (i = 0; i <= this.docs.length; i++) {
            let x = this.docs[i].path.split("/");
            console.log("this file has " + (x.length - 2) + " folder(s)");
            for (i = 1; i < x.length; i++) {
              let y = 0;
              if (folders[y] == undefined || folders[y] == x[i]) {
                folders[y] = x[i]
                y++;
              }
            }
          }
        }
      );

  }




  getpaths() {
    var i;
    return this.getDocs()
      .subscribe(
        docs => {
          this.docs = docs
          for (i = 0; i < this.docs.length; i++) {
            console.log(this.docs[i].path)
          }

        })
  }


}
