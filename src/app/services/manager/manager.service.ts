import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from 'src/app/models/Project.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User.model';


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



}
