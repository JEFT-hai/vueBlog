import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IdAuthInfo } from './idAuthInfo';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private baseUrl = environment.userInfoApiHost; // URL to web api
  private identityUrl = this.baseUrl + 'IdAuthInfo/'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** GET heroes from the server */
  getIdAuthInfos(): Observable<IdAuthInfo[]> {
    return this.http.get<IdAuthInfo[]>(this.identityUrl).pipe(
      // tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<IdAuthInfo[]>('get IdAuthInfos', []))
    );
  }

  /** GET heroes from the server */
  getIdAuthInfo(id: string): Observable<IdAuthInfo> {
    return this.http.get<IdAuthInfo>(this.identityUrl + id).pipe(
      // tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<IdAuthInfo>('get IdAuthInfo'))
    );
  }

  /** GET heroes from the server */
  updateIdAuthInfo(auth: IdAuthInfo): Observable<IdAuthInfo> {
    return this.http.put(this.identityUrl, auth, this.httpOptions).pipe(
      // tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('update auth'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
