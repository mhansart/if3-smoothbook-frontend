import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Connexion } from '../models/connexion.model';
import { DataUser } from '../models/dataUser.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUserSubject:BehaviorSubject<DataUser>;
  public currentUser: Observable<DataUser>;

  constructor(private _client: HttpClient, private _router:Router) { 
    this._currentUserSubject = new BehaviorSubject<DataUser>(JSON.parse(localStorage.getItem('adminIs')));
    this.currentUser = this._currentUserSubject.asObservable();

   }
   public get currentUserValue():DataUser{
     return this._currentUserSubject.value;
   }
   signIn(connexion:Connexion){
     return this._client.post<DataUser>(`${environment.apiUrl}/Login`, connexion).pipe(map(user=>{
        localStorage.setItem('adminIs', JSON.stringify(user));
        this._currentUserSubject.next(user);
        return user;
    }))

   }
   signOut(){
     localStorage.removeItem('adminIs');
     this._currentUserSubject.next(null);
     this._router.navigate(['/adminafg']);

   }
}
