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
  private tree: FoodNode[] = [];


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

  organize() {
    var i;
    var j;
    return this.getDocs()
      .subscribe(
        docs => {
          this.tree = []
          this.docs = docs
          let folders = [];
          let files = [];
          let x = [];
          //Décomposition des paths en 
          for (i = 0; i < this.docs.length; i++) {
            x[i] = this.docs[i].path.split("/");
            console.log(this.docs[i].path + " has " + (x[i].length - 2) + " folder(s) root included");
          }
          let max = x[0].length;
          let tabnum = 0;
          for (i = 0; i < x.length; i++) {
            console.log(x[i]);

            if (max < x[i].length) {
              max = x[i].length;
              tabnum = i;
            }

            /*
          console.log(x[i][2]) */
            let obj1: FoodNode;
            obj1 = {
              name: "",
              children: []
            }
            for (j = 0; j < x[i].length - 1; j++) {
              //console.log(x[i][j]);

              obj1.name = x[i][j];
              //tree.push(obj1)
              //console.log(obj1);
              //console.log(obj1);
              //console.log(this.tree);
              /*    this.tree.push({
                   name: String(x[i][j]),
                   children: []
                 }) */


            }
            console.log("max" + max);
            console.log("tableau numero " + (tabnum - 1));


            // dossier vide
            //console.log(x[i][x[i].length - 1]);
            //console.log(tree);





          }
          let o = {};
          this.assign(o, x[tabnum - 1], "result")
          // console.log(this.tree);
          console.log(o);



          /* for (i = 1; i < x.length; i++) {
            let y = 0;
            if (folders[y] == undefined || folders[y] == x[i]) {
              folders[y] = x[i]
              y++;
            }
          } */
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


  assign(obj: Object, keyPath: Array<string>, value: string) {
    let lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
      let key = keyPath[i];
      if (!(key in obj))
        obj[key] = {}
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }
}
