import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Connexion } from '../models/connexion.model';
import { DataUser } from '../models/dataUser.model';
import { NewUser } from '../models/newUser.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuth:string = localStorage.getItem('isAuth')? localStorage.getItem('isAuth'):'notAuth' ;

  constructor(private _client: HttpClient) { }

  // Get all users
  GetUsers() :Observable<User[]> {
    return this._client.get<User[]>(`${environment.apiUrl}/user`);
  }

  // Get one user
  GetUser(email:string): Observable<User[]> {
    return this._client.get<User[]>(`${environment.apiUrl}/user/${email}`)
  }

  updateUser(user:DataUser,id:number) {
    return this._client.put<DataUser>(`${environment.apiUrl}/user/${id}`, user)
  }
  addUser(user:NewUser){
    return this._client.post<NewUser>(`${environment.apiUrl}/user`, user)
  }
  deleteUser(id:number){
    return this._client.delete(`${environment.apiUrl}/user/${id}`)
  }
  passwordIsOk(connexion:Connexion){
    return this._client.post<DataUser>(`${environment.apiUrl}/Login`, connexion).pipe(map(user=>{
      return user;
  }))

  }
  updatePsw(connexion:Connexion,id:number) {
    return this._client.put<DataUser>(`${environment.apiUrl}/user/mdp/${id}`, connexion)
  }
  sendEmail(user:User){
    return this._client.post<User>(`${environment.apiUrl}/sendmail`, user)
  }

}
