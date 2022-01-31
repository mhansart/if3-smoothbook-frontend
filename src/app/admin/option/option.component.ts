import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/models/pages.model';
import { Post } from 'src/app/models/post.model';
import { ModalService } from 'src/app/services/modal.service';
import { PostsService } from 'src/app/services/posts.service';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
  isPost: boolean;
  pages: Page[] = [];
  errorMessage: string;
  posts: Post[] = [];
  allSelect: boolean = false;
  checkbox: number[] = [];


  constructor(private _pagesService: PagesService, private _postsService: PostsService, private _router: Router, private _formBuilder: FormBuilder, private _modalService: ModalService) {
    document.getElementById('loader-admin').style.display="flex"
   }


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

    this.isPost = this._router.url.includes('optionpost') ? true : false;
    if (this.isPost) {
      this._postsService.GetPosts().subscribe(data => {
        this.posts = data;
      });
    }
    else {
      this._pagesService.getPages().subscribe(data =>
        this.pages = data);
    }
  }

  //delete page & post
  deletePage(id: number) {
    const pageName = this.pages.filter((x) => { return x.id === id });
    this._modalService.openModal(`la page "${pageName[0].name}"`);
    this._modalService.onClose.subscribe(data => {
      if (data) {
        this.pages = this.pages.filter((x) => {
          return x.id != id
        })
        this._pagesService.deletePage(id).subscribe({
          next: () => {
          },
          error: error => {
            this.errorMessage = error;
            console.log(error);
          }

        })
      }
    })
  }
  deletePost(id: number) {
    const postName = this.posts.filter((x) => { return x.id === id });
    this._modalService.openModal(`l'article "${postName[0].title}"`);
    this._modalService.onClose.subscribe(data => {
      if (data) {
        this.posts = this.posts.filter((x) => {
          return x.id != id
        })
        this._postsService.deletePost(id).subscribe({
          next: () => {
          },
          error: error => {
            this.errorMessage = error;
            console.log(error);
          }

        })
      }
    })
  }

  // Edit page & post
  editPage(id: number) {
    this._router.navigate([`/adminafg/updatepage/${id}`])
  }
  editPost(id: number) {
    this._router.navigate([`/adminafg/updatepost/${id}`])
  }

  // Active page & post
  activatePage(id: number) {
    const thispage = this.pages.filter((x) => x.id === id);
    const data = thispage[0].active == '0' ? "1" : "0";
    this.pages.forEach((x) => {
      if (x.id === id) {
        x.active = data;
      }
    })
    const active = { active: data };
    this._pagesService.activatePage(id, active).subscribe({
      next: () => {

      },
      error: error => {
        this.errorMessage = error;
        console.log(error);
      }
    })
  }
  activatePost(id: number) {
    const thispost = this.posts.filter((x) => x.id === id);
    const data = thispost[0].active == '0' ? "1" : "0";
    this.posts.forEach((x) => {
      if (x.id === id) {
        x.active = data;
      }
    })
    const active = { active: data };
    this._postsService.activatePost(id, active).subscribe({
      next: () => {
      },
      error: error => {
        this.errorMessage = error;
        console.log(error);
      }
    })
  }

  // fonctions sur les checkbox
  selectAll() {
    this.allSelect = !this.allSelect;
    const allInputs = document.querySelectorAll('.all-inputs');
    if (!this.allSelect) {
      this.checkbox = [];
    } else {
      allInputs.forEach((x, i) => {
        this.checkbox.push(Number(x.id.split('-')[0]));
      })
    }
  }

  selectOne(event) {
    if (event.target.checked) {
      this.checkbox.push(Number(event.target.id.split('-')[0]))
    } else {
      this.checkbox = this.checkbox.filter((x) => { return x !== Number(event.target.id.split('-')[0]) })
    }
  }

  // Les différentes actions groupées
  allActions(event) {
    const action = event.target.value;
    if (action === "supprimer") {
      const name = this.isPost ? 'supprimer ces articles' : 'supprimer ces pages'
      this._modalService.openModal(name);
      this._modalService.onClose.subscribe(data => {
        if (data) {
          if (this.isPost) {
            this.checkbox.forEach((id) => {
              this.posts = this.posts.filter((x) => {
                return x.id != id
              })
              this._postsService.deletePost(id).subscribe({
                next: () => {
                },
                error: error => {
                  this.errorMessage = error;
                  console.log(error);
                }
              })
            })
          } else {
            this.checkbox.forEach((id) => {
              this.pages = this.pages.filter((x) => {
                return x.id != id
              })
              this._pagesService.deletePage(id).subscribe({
                next: () => {
                },
                error: error => {
                  this.errorMessage = error;
                  console.log(error);
                }
              })
            })
          }
          this.checkbox = [];
        }
      })
    } if (action === "desactiver" || action === "activer") {
      const data = action === "desactiver" ? "0" : "1";
      const active = { active: data };
      this.checkbox.forEach((id) => {
        if (this.isPost) {
          this._postsService.activatePost(id, active).subscribe({
            next: () => {
            },
            error: error => {
              this.errorMessage = error;
              console.log(error);
            }
          })
          this.posts.forEach((x) => {
            if (this.checkbox.includes(x.id)) {
              x.active = data;
            }
          })
        } else {
          this._pagesService.activatePage(id, active).subscribe({
            next: () => {
            },
            error: error => {
              this.errorMessage = error;
              console.log(error);
            }
          })
          this.pages.forEach((x) => {
            if (this.checkbox.includes(x.id)) {
              x.active = data;
            }
          })

        }

      })


    }
  }


}
