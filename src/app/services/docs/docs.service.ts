import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/models/Doc.model';
import { Tree } from '@angular/router/src/utils/tree';
import { Sug } from 'src/app/models/Sug.model';
import { Config } from 'src/app/configuration/conf';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private apiURL = "http://" + Config.HOST + ":" + Config.PORT + "/api/";
  private docsUrl = this.apiURL + 'db/docs';  // URL to web api


  docs: Doc[];

  constructor(private http: HttpClient) { }

  getDocById(id: number): Observable<Doc> {
    const url = `${this.docsUrl + "/id"}/${id}`;
    return this.http.get<Doc>(url);
  }

  addDoc(doc: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.docsUrl, doc, httpOptions);
  }

  updateDoc(doc: Doc): Observable<any> {
    return this.http.put(this.docsUrl, doc, httpOptions);

  }

  /* Suggestions */

  getSuggestions(id: number) {
    return this.http.get<Sug[]>(this.apiURL + "db/sugs/" + id);
  }

  addSuggestion(suggestion: Sug) {
    return this.http.post<Sug>(this.apiURL + "db/sugs", suggestion, httpOptions);
  }

  updateSuggestion(suggestion: Sug) {
    return this.http.put(this.apiURL + "db/sugs", suggestion, httpOptions)
  }

  deleteSuggestion(id: number) {
    return this.http.delete<Sug>(this.apiURL + "db/sugs/" + id)
  }



}
