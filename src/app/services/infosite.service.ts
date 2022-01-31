import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Infos } from '../models/infossite.model';
import { NewInfos } from '../models/newInfos.model';
import { NewViewsSite } from '../models/newViewsSite.model';
import { ViewsSite } from '../models/viewsSite.model';

@Injectable({
  providedIn: 'root'
})
export class InfositeService {

  constructor(private _client: HttpClient) { }
  
  getInfos():Observable<Infos[]>{
    return this._client.get<Infos[]>(`${environment.apiUrl}/infos`);
  }
  getViews():Observable<ViewsSite[]>{
    return this._client.get<ViewsSite[]>(`${environment.apiUrl}/analytics`);
  }
  updateViews(month:number,views:NewViewsSite){
    return this._client.put(`${environment.apiUrl}/analytics/${month}`, views);
  }
  addViews(views:NewViewsSite){
    return this._client.post(`${environment.apiUrl}/analytics`, views);
  }
  updateInfos(infos:NewInfos){
    return this._client.put(`${environment.apiUrl}/infos/${infos.infos_name}`, infos);
  }
}

