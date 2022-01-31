import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Post } from 'src/app/models/post.model';
import { InfositeService } from 'src/app/services/infosite.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post: Post[] = [];
  h: number | string
  imgUrl: string;
  content;
  urlImg: string = environment.imgUrl;
  urlPage: string;
  month = moment().month();
  year = moment().year();

  constructor(private _route: ActivatedRoute, private _router: Router, private _postsService: PostsService, private _modalService: ModalImageService, private _infosService: InfositeService, private titleService: Title) { }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function () { document.getElementById('loader-site').style.display = "none" }, 1000);

    this.urlPage = this._router.url;
    this._postsService.getPost(this._route.snapshot.params['id']).subscribe((data: Post[]) => {
      if (data[0] == undefined || data[0]?.active == "0") {
        this._router.navigate(['/error']);
      } else {
        if (localStorage.getItem('adminIs') == null) {
          const views = JSON.parse(data[0].views);
          const viewsId = views.findIndex((x) => x.month == this.month);
          if (viewsId == -1) {
            views.push({ month: this.month, year:this.year, views: 1 });
          } else {
            views[viewsId].views++;
          }
          this._postsService.updateViews({ views: JSON.stringify(views) }, data[0].id).subscribe();
        }
        this.imgUrl = `${environment.imgUrl}/${data[0].picture}`
        this.content = JSON.parse(data[0].content);
        this.post = data;
        this._infosService.getInfos().subscribe(data => {
          const title = data.filter((x) => x.infos_name === "title_name");
          this.setTitle(`${title[0].infos_value} - ${this.post[0].title}`);
        })
      }

    })
    this.h = window.innerWidth > 992 ? window.innerHeight - 75 : "auto";
  }
  openModal(i: number) {
    this._modalService.openModal(this.content.pictures, i)
  }
  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
