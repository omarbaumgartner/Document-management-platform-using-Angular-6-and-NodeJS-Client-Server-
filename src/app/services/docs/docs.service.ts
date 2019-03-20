import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/models/Doc.model';
import { Tree } from '@angular/router/src/utils/tree';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface FoodNode {
  name: string;
  children?: { [index: number]: FoodNode };
}



@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private docsUrl = 'http://localhost:8080/api/db/docs';  // URL to web api

  //private docsUrl = 'http://52.29.87.21:8080/api/db/docs';  // URL to web api
  private tree: FoodNode[] = [];


  docs: Doc[];

  folders: string[];

  obj = {
    name: "root",
    children: []
  }
  treetest: JSON;
  test: string;

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
  organize() {
    var i;
    this.getDocs()
      .subscribe(
        docs => {
          this.tree = [];
          this.docs = docs;
          let x = [];
          //Décomposition des paths en 
          for (i = 0; i < this.docs.length; i++) {
            x[i] = this.docs[i].path.split("/");
            console.log(x[i]);
          }
          let max = x[0].length;
          let tabnum = 0;
          for (i = 0; i < x.length; i++) {
            if (max < x[i].length) {
              max = x[i].length;
              tabnum = i;
            }
          }

          console.log("max : " + max);
          console.log("tabnum : " + tabnum);
          this.assignArrayToJson(this.obj, x[tabnum - 1])
          console.log(this.obj)
        }
      );


  }


  assignArrayToJson(obj: Object, valuePath: Array<string>) {
    let lastKeyIndex = valuePath.length - 1;
    for (var i = 0; i <= lastKeyIndex; ++i) {
      let value = valuePath[i];
      if (!(value in obj)) {
        obj["children"] = [{ name: value }]
        //obj["children"] = { name: value }


      }
      obj = obj["children"];

    }


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
