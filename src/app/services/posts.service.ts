import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';
import { Inactive } from '../models/inactive.model';
import { newPost } from '../models/newPost.model';
import { PostPage } from '../models/newPostPage.model';
import { Views } from '../models/views.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _client: HttpClient) { }

  // Get all objects
  GetPosts() : Observable<Post[]> {
    return this._client.get<Post[]>(`${environment.apiUrl}/post`);
  }

  // Get one post
  getPost(id:number) : Observable<Post[]> {
    return this._client.get<Post[]>(`${environment.apiUrl}/post/${id}`);
  }

  // activate/desactivate one post
  activatePost(id:number, active:Inactive){
    return this._client.put(`${environment.apiUrl}/post/active/${id}`, active);
  }
  // delete one post
  deletePost(id:number){
    return this._client.delete(`${environment.apiUrl}/post/${id}`);
  }
  //  add one post
  addPost(post:newPost) {
    console.log(post);
    return this._client.post<newPost>(`${environment.apiUrl}/post`, post)
  }
  // update one post
  updatePost(post:newPost, id:number) {
    return this._client.put<newPost>(`${environment.apiUrl}/post/${id}`, post)
  }

  // add post on one page
  addPostPage(ids:PostPage){
    return this._client.post<PostPage>(`${environment.apiUrl}/post_page`, ids)
  }
  deletePostPage(id:PostPage){
    return this._client.delete<PostPage>(`${environment.apiUrl}/post_page/${id}`)
  }

  getPostPage(id:number){
    return this._client.get<PostPage[]>(`${environment.apiUrl}/post_page/${id}`)
  }
  updateViews(views:Views,id:number) {
    return this._client.put<Views>(`${environment.apiUrl}/post/views/${id}`, views)
  }


}
