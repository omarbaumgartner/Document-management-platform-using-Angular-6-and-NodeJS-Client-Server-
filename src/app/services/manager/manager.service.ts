import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from 'src/app/models/Project.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { Doc } from 'src/app/models/Doc.model';
import { Cont } from 'src/app/models/Cont.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiURL = 'http://localhost:8080/api/';  // URL to web api

  projects: Project[];
  constructor(private http: HttpClient) { }

  // Projects Methods
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiURL + "projects");
  }

  getUserProjects(id: Array<number>): Observable<Project> {
    return this.http.post<Project>(this.apiURL + "projects", [id], httpOptions);
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
  addDocument(document: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.apiURL + "db/docs", document, httpOptions);
  }

  updateDocument(document: Doc): Observable<any> {
    return this.http.put(this.apiURL + "db/docs", document, httpOptions);
  }

  getDocuments(id): Observable<Doc> {
    return this.http.get<Doc>(this.apiURL + "db/projdocs/" + id);
  }

  getSingleDocument(id): Observable<Doc> {
    return this.http.get<Doc>(this.apiURL + "db/singledoc/" + id);
  }

  deleteDocument(document: Doc | number): Observable<Doc> {
    const id = typeof document === 'number' ? document : document.id;
    const url = `${this.apiURL}db/docs/${id}`;
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


}
