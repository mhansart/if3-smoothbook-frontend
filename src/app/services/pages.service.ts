import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page } from '../models/pages.model';
import { newPage } from '../models/newpage.model';
import { Inactive } from '../models/inactive.model';
import { Views } from '../models/views.model';

@Injectable({
  providedIn: 'root'
})

export class PagesService {

  constructor(private _client: HttpClient) { }

  getPages():Observable<Page[]>{
    return this._client.get<Page[]>(`${environment.apiUrl}/page`);
  }

  getPage(route:string): Observable<Page[]> {
    return this._client.get<Page[]>(`${environment.apiUrl}/page/${route}`)
  }

  getById(id:number): Observable<Page[]> {
    return this._client.get<Page[]>(`${environment.apiUrl}/page/byId/${id}`)
  }

  addPage(page:newPage) {
    return this._client.post<newPage>(`${environment.apiUrl}/page`, page)

  }
  updatePage(page:newPage,id:number) {
    return this._client.put<newPage>(`${environment.apiUrl}/page/${id}`, page)

  }
  deletePage(id:number){
    return this._client.delete(`${environment.apiUrl}/page/${id}`);
  }
  activatePage(id:number, active:Inactive){
    return this._client.put(`${environment.apiUrl}/page/active/${id}`, active);
  }
  updateViews(views:Views,id:number) {
    return this._client.put<Views>(`${environment.apiUrl}/page/views/${id}`, views)
  }


}