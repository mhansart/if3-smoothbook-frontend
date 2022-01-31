import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { newPost } from 'src/app/models/newPost.model';
import { Page } from 'src/app/models/pages.model';
import { Post } from 'src/app/models/post.model';
import { ImageService } from 'src/app/services/image.service';
import { ModalService } from 'src/app/services/modal.service';
import { PagesService } from 'src/app/services/pages.service';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import * as ClassicEditor from '../../../ckeditor';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss']
})
export class AddpostComponent implements OnInit {

  fg: FormGroup;
  updatePost: boolean = false;
  post: Post[] = [];
  mainImage: File;
  mainImgUrl: string | ArrayBuffer;
  multipleImage: File[] = [];
  multipleImgUrl: { name: string, url: (string | ArrayBuffer) }[] = [];
  newContent;
  newPost: newPost;
  errorMessage: string;
  pages: Page[] = [];
  checkbox: number[] = [];
  public Editor = ClassicEditor;
  envUrl = environment.imgUrl;
  updatedContent;

  constructor(private _formBuilder: FormBuilder, private _postsService: PostsService, private _router: Router, private _imageService: ImageService, private _route: ActivatedRoute, private _pagesService: PagesService) { document.getElementById('loader-admin').style.display="flex" }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function () { document.getElementById('loader-admin').style.display = "none" }, 1000);

    // responsive menu
    if (window.innerWidth < 992) {
      const menu = document.querySelector('header');
      if (!menu.classList.contains('menu-closed')) menu.classList.add('menu-closed');
      const burger = document.querySelector('.menu-burger');
      burger.classList.remove('cross-menu');
    }
    // initialiser le formgroup
    this.fg = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      title: ['', Validators.required],
      picture: ['', Validators.required],
      place: ['', Validators.required],
      year: ['', Validators.required],
      characteristics: ['', Validators.required],
      pictures: [[], Validators.required],
    })

    // vérifier si c'est un ajout ou une modification
    if (this._route.snapshot.params['id']) {
      this.updatePost = true;

      // rechercher les infos de l'article pour le modifier
      this._postsService.getPost(this._route.snapshot.params['id']).subscribe(post => {
        this.post = post;
        this.mainImgUrl = `${this.envUrl}/${this.post[0].picture}`
        this.updatedContent = JSON.parse(this.post[0].content);
        this.fg.setValue({
          title: this.post[0].title, picture: '',
          place: this.updatedContent?.place,
          year: Number(this.updatedContent?.year),
          characteristics: this.updatedContent?.description,
          pictures: []
        })
        this.updatedContent.pictures.forEach((x) => {
          this.multipleImgUrl.push({ name: x.picture, url: `${this.envUrl}/${x.picture}` });
          this.multipleImage.push(undefined);
        })
      })

      //  rechercher sur quelles pages il est affiché
      this._postsService.getPostPage(this._route.snapshot.params['id']).subscribe(data => {
        data.forEach((x) => {
          this.checkbox.push(x.page_id);
        })
      })

    }

    // aller chercher toutes les pages qui sont portfolios
    this._pagesService.getPages().subscribe(
      (pages: Page[]) => {
        this.pages = pages.filter((x) => { return x.type === "portfolio" });
      })


  }

  onSubmit() {

    // récupérer la taille de chaque image
    const allImg = document.querySelectorAll<HTMLElement>('.multiple-img');
    const title = this.fg.value["title"];
    this.newContent = { year: this.fg.value['year'], place: this.fg.value['place'], description: this.fg.value['characteristics'], pictures: [] }
    allImg.forEach((x, i) => {
      const img = this.multipleImgUrl[i] == undefined ? this.updatedContent.pictures[i].picture : this.multipleImgUrl[i].name;
      if (x.offsetHeight >= x.offsetWidth) {
        this.newContent.pictures.push({ picture: img, orientation: 'vertical' });
      } else {
        this.newContent.pictures.push({ picture: img, orientation: 'horizontal' });
      }
    })

    // Envoyer les images vers le serveur pour les enregistrer dans uploads
    const formData = new FormData();
    for (let img of this.multipleImage) {
      if (img !== undefined) {
        formData.append('files', img);
      }
    }
    formData.append('files', this.mainImage);

    this._imageService.uploadImage(formData).subscribe();

    const isActive: string = this.updatePost ? this.post[0].active : "1"
    const mainImg = this.mainImage != undefined ? this.mainImage.name : this.post[0].picture;
    this.newPost = { title: title, picture: mainImg, content: JSON.stringify(this.newContent), active: isActive, date: new Date };

    // Si c'est ajouter
    if (!this.updatedContent) {
      this._postsService.addPost(this.newPost).subscribe(infos => {
        const idpost = Number(infos);
        this.checkbox.forEach((idpage) => {
          const ids = { page_id: idpage, post_id: idpost };
          this._postsService.addPostPage(ids).subscribe({
            next: () => {
              this._router.navigate(['/adminafg/optionpost']);
            },
            error: error => {
              this.errorMessage = error;
              console.log(error);
            }
          })
        })
      })
    } else {
      this._postsService.deletePostPage(this._route.snapshot.params['id']).subscribe({
        next: () => {
          this._postsService.updatePost(this.newPost, this._route.snapshot.params['id']).subscribe(infos => {
            this.checkbox.forEach((idpage) => {
              const ids = { page_id: idpage, post_id: this._route.snapshot.params['id'] };
              this._postsService.addPostPage(ids).subscribe({
                next: () => {
                  this._router.navigate(['/adminafg/optionpost']);
                },
                error: error => {
                  this.errorMessage = error;
                  console.log(error);
                }
              })
            })
          })
        },
        error: error => {
          this.errorMessage = error;
          console.log(error);
        }
      })

    }
  }

  onSelectFile(event, type: string) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      if (type === "main") {
        this.mainImage = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.mainImgUrl = event.target.result;
        }
      }
      if (type === "all") {
        for (let i = 0; i < event.target.files.length; i++) {
          let isInUpdated = [];
          const isIn = this.multipleImage.filter((x) => { if (x != undefined) { return x.name == event.target.files[i].name } })
          if (this.updatePost) {
            isInUpdated = this.updatedContent.pictures.filter((x) => { return x.picture == event.target.files[i].name })
          }
          if (isIn.length == 0 && isInUpdated.length == 0) {
            this.multipleImage.push(event.target.files[i]);
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[i]); // read file as data url
            reader.onload = (e) => { // called once readAsDataURL is completed
              this.multipleImgUrl.push({ name: event.target.files[i].name, url: e.target.result });
            }
          }
        }
      }
    }
  }

  selectOne(event) {
    if (event.target.checked) {
      this.checkbox.push(Number(event.target.id.split('-')[0]))
    } else {
      this.checkbox = this.checkbox.filter((x) => { return x !== Number(event.target.id.split('-')[0]) })
    }
  }
  deleteImg(id: number) {
    this.multipleImgUrl = this.multipleImgUrl.filter((x, i) => { return i != id });
    this.multipleImage = this.multipleImage.filter((x, i) => { return i != id });
    if (this.updatePost) {
      this.updatedContent.pictures = this.updatedContent.pictures.filter((x, i) => { return i != id });
    }
  }

}
