import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CompanyAuth } from './companyAuth';

@Injectable({
  providedIn: 'root'
})
export class CompanyAuthService {
  private baseUrl = environment.houseApiHost; // URL to web api
  private identityUrl = this.baseUrl + 'CompanyAuthBack/'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** GET heroes from the server */
  getList(): Observable<CompanyAuth[]> {
    return this.http.get<CompanyAuth[]>(this.identityUrl);
  }

  /** GET heroes from the server */
  getEntity(id: string): Observable<CompanyAuth> {
    return this.http.get<CompanyAuth>(this.identityUrl + id);
  }

  /** GET heroes from the server */
  updateEntity(auth: CompanyAuth): Observable<Response> {
    return this.http.put<Response>(this.identityUrl, auth, this.httpOptions);
  }
}
