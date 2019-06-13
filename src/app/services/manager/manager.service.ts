import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from 'src/app/models/Project.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { Doc } from 'src/app/models/Doc.model';
import { Cont } from 'src/app/models/Cont.model';
import { Router } from '@angular/router';
import { Config } from 'src/app/configuration/conf';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private apiURL = "http://" + Config.HOST + ":" + Config.PORT + "/api/";

  projects: Project[];
  resultnumber: any;
  results: any;
  hasSearched: boolean = false;
  searchTerm: string;
  observableProjects = new BehaviorSubject<Project[]>(null);
  observableDocs = new BehaviorSubject<Doc[]>(null);
  abracadabra: Doc[] = new Array<Doc>();

  constructor(private http: HttpClient,
    private router: Router) {
    this.getProjects()
      .subscribe(
        projects => {
          this.observableProjects.next(projects);
        }
      );
    this.getDocs()
      .subscribe(
        documents => {
          this.observableDocs.next(documents);
        }
      )
  }

  // Projects Methods
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiURL + "projects");
  }

  getUserProjects(id: Array<number>): Observable<Project[]> {
    return this.http.post<Project[]>(this.apiURL + "projects", [id], httpOptions);
  }

  getProjectById(id): Observable<Project> {
    return this.http.get<Project>(this.apiURL + "project/" + id);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiURL + "project", project, httpOptions);
  }

  updateProject(project: Project): Observable<any> {
    return this.http.put(this.apiURL + "project", project, httpOptions);
  }

  deleteProject(project: Project | number): Observable<Project> {
    const id = typeof project === 'number' ? project : project.id;
    const url = `${this.apiURL}project/${id}`;
    return this.http.delete<Project>(url, httpOptions);
  }

  // Documents Methods 

  getDocs(): Observable<Doc[]> {
    return this.http.get<Doc[]>(this.apiURL + "db/docs");
  }

  addDocument(document: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.apiURL + "db/docs", document, httpOptions);
  }

  updateDocument(document: Doc): Observable<any> {
    return this.http.put(this.apiURL + "db/docs", document, httpOptions);
  }

  // change to getProjectDocs
  getDocuments(id): Observable<Doc> {
    return this.http.get<Doc>(this.apiURL + "db/projdocs/" + id);
  }

  getSingleDocument(id): Observable<Doc> {
    return this.http.get<Doc>(this.apiURL + "db/singledoc/" + id);
  }

  deleteDocument(document: Doc | number): Observable<Doc> {
    console.log("document")
    const id = typeof document === 'number' ? document : document.id;
    const url = `${this.apiURL}db/docs/${id}`;
    console.log(url);
    return this.http.delete<Doc>(url, httpOptions);
  }

  //  Content Methods 
  getDocumentById(id): Observable<Cont> {
    return this.http.get<Cont>(this.apiURL + "db/cont/" + id);
  }

  newDocVersion(document: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.apiURL + "db/docs/newversion", document, httpOptions);
  }

  updateContent(content: Cont): Observable<any> {
    return this.http.put(this.apiURL + "db/cont", content, httpOptions);
  }

  // Search Methods
  searchFor(keyword: string): Observable<any> {
    return this.http.get<Doc>(this.apiURL + "db/search/" + keyword);
  }

  restrictedSearchFor(keyword: string): Observable<any> {
    return this.http.get<Doc>(this.apiURL + "db/searchfor/" + keyword);
  }

  fromIdToProjectnames(id, projects: Project[]) {
    // console.log(ids);
    var i = 0;
    // console.log(ids);
    while (id != projects[i].id) {
      i++;
    }
    return projects[i].name;
  }

  onResearch(term: string) {
    if (term != "") {
      this.searchFor(term)
        .subscribe((val) => {
          this.searchTerm = term;
          this.resultnumber = val.length;
          this.results = val;
          this.hasSearched = true;
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/wiki"]));
        })
    }
    else {
      this.results = null;
      this.resultnumber = 0;
    }
  }

  onRestrictedResearch(term: string, id: number) {
    if (term != "") {
      this.restrictedSearchFor(term + "+" + id)
        .subscribe((val) => {
          console.log(term);
          console.log(id);
          console.log(val);
          this.searchTerm = term;
          if (val.length != undefined && val.length > 0) {
            this.results = val;
            this.resultnumber = val.length;
            this.test();
          }
          else {
            console.log("is null")
            this.results = [];
            this.abracadabra = [];
            this.resultnumber = 0;
          }
          this.hasSearched = true;
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/wiki"]));
        })
    }
    else {
      this.results = null;
      this.resultnumber = 0;
    }
  }

  reloadProjects() {
    this.getProjects()
      .subscribe(
        projects => {
          this.observableProjects.next(projects);
        }
      )
  }

  reloadDocuments() {
    this.getDocs()
      .subscribe(
        docs => {
          this.observableDocs.next(docs);
        }
      )
  }

  test() {
    let i;
    let filenames = new Array<any>();
    let ids = new Array<any>();
    filenames[0] = this.results[0].documentid;
    ids[0] = 0;
    for (i = 0; i < this.results.length; i++) {
      if (filenames.includes(this.results[i].documentid) == false) {
        filenames.push(this.results[i].documentid);
        ids.push(i);
      }
    }
    for (i = 0; i < ids.length; i++) {
      let temporaryContent = this.results[i].content;
      this.results[i].content = new Array<any>();
      this.results[i].content.push(temporaryContent);
      for (let j = ids.length; j < this.results.length; j++) {
        if (this.results[i].documentid == this.results[j].documentid) {
          this.results[i].content.push(this.results[j].content);
        }
      }

    }
    for (i = 0; i < ids.length; i++) {
      this.abracadabra[i] = this.results[i];
    }
    this.resultnumber = this.abracadabra.length;
  }
}
