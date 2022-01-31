import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Page } from 'src/app/models/pages.model';
import { PagesService } from 'src/app/services/pages.service';
import { ViewEncapsulation } from '@angular/core'
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/models/post.model';
import { InfositeService } from 'src/app/services/infosite.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit {

  page: Page[] = [];
  newContent: string = '';
  error: boolean = false;
  h: number;
  posts: Post[];
  urlImg: string = environment.imgUrl;
  month = moment().month();
  year = moment().year();

  constructor(private _route: ActivatedRoute, private _router: Router, private _pagesService: PagesService, private _infosService: InfositeService, private titleService: Title) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function () { document.getElementById('loader-site').style.display = "none" }, 1000);

    // responsive menu
    if (window.innerWidth <= 768) {
      const burger = document.querySelector('.menu-burger-site');
      burger.classList.remove('cross-menu');
      const menu = document.querySelector('.nav-site');
        menu.classList.remove('menu-closed-site');
    }

    this.h = window.innerHeight - 35;
    this._pagesService.getPage(this._route.snapshot.params.name).subscribe(
      (page: Page[]) => {
        if (page !== [] && page[0]?.active == '1') {
          if (localStorage.getItem('adminIs') == null) {
            const views = JSON.parse(page[0].views);
            const viewsId = views.findIndex((x) => x.month == this.month);
            if (viewsId == -1) {
              views.push({ month: this.month, year:this.year, views: 1 });
            } else {
              views[viewsId].views++;
            }
            this._pagesService.updateViews({ views: JSON.stringify(views) }, page[0].id).subscribe();
          }
          this.page = page;
          this._infosService.getInfos().subscribe(data => {
            const title = data.filter((x) => x.infos_name === "title_name");
            this.setTitle(`${title[0].infos_value} - ${this.page[0].name}`);
          })
          if (this.page[0].type === "page") {
            if (this.page[0].content !== '') {
              (JSON.parse(this.page[0].content)).forEach((x, i) => {
                if (x.type === "text") {
                  this.newContent += `<div class="text-content">${x.text}</div>`;
                }
                if (x.type === "text-image") {
                  this.newContent += `<div class="d-flex text-image-content"><div class="text-content-left">${x.text}</div><div class="img-dflex"><div class="bloc-color"><img src="${environment.imgUrl}/${x.image}" alt="essai"/></div></div></div>`;
                }
                if (x.type === "image-text") {
                  this.newContent += `<div class="d-flex image-text-content"><div class="img-dflex"><div class="bloc-color"><img src="${environment.imgUrl}/${x.image}" alt="essai"/></div></div><div class="text-content-right">${x.text}</div></div>`;
                }
                if (x.type === "image") {
                  this.newContent += `<div class="image-content"><img src="${environment.imgUrl}/${x.image}" alt="essai"/></div>`;
                }
                if (x.type === "bloc-text") {
                  this.newContent += `<div class="bloc-text-content">${x.text}</div>`;
                }
              })
            }
          } else if (this.page[0].type === "portfolio") {
            this.posts = this.page[0].posts.filter((x) => { return x.active == "1" });
          }

        } else {
          this._router.navigate([`/error`])
        }

      })
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
