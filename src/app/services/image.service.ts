import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public uploadImage(formData) {
    return this.http.post<any>(`${environment.apiUrl}/files`, formData)
  }
  public uploadFavicon(formData) {
    return this.http.post<any>(`${environment.apiUrl}/favicon`, formData)
  }
  public uploadLogo(formData) {
    return this.http.post<any>(`${environment.apiUrl}/logo`, formData)
  }
}
