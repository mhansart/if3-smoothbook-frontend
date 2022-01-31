import { Component, OnInit } from '@angular/core';
import { ViewsSite } from 'src/app/models/viewsSite.model';
import { InfositeService } from 'src/app/services/infosite.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
  h: number;
  modalOpen: boolean = false;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  constructor(private _modalService: ModalImageService, private _infosService: InfositeService) { }

  ngOnInit(): void {
    this.h = window.innerHeight - 35;
    this.modalOpen = this._modalService.isOpen;
    this._infosService.getInfos().subscribe(data => {
      const fav = data.filter((x) => x.infos_name === "favicon_image");

      this.favIcon.href = `${environment.imgUrl}/${fav[0].infos_value}`;
    })
    this._infosService.getViews().subscribe(data => {
      if (localStorage.getItem('adminIs') == null) {
        let views;
        const day = (new Date).getDay();
        const month = (new Date).getMonth();
        const year = (new Date).getFullYear();
        const isIn = data.filter((x) => { return x.month == month && x.year == year })

        // trouver la date du jour
        const date = `${(new Date).getDate()}/${(new Date).getMonth() + 1}/${(new Date).getFullYear()}`;

        if (isIn.length == 0) {
          views = {
            days: [],
            views: []
          };
          for (let i = 0; i < 7; i++) {
            if (i == day) {
              views.days.push({ day: i, views: 1 })
            } else {
              views.days.push({ day: i, views: 0 })
            }
          }
          views.views.push({ date: date, views: 1 });
          this._infosService.addViews({ month: month, year:year, views: JSON.stringify(views), views_month: 1 }).subscribe();
        } else {
          views = JSON.parse(isIn[0].views);
          // ajouter 1 vue au jour de la semaine
          views.days[day].views++;

          // ajouter 1 vue à la date du jour
          const idDate = views.views.findIndex((x) => x.date == date);
          if (idDate == -1) {
            views.views.push({ date: date, views: 1 });
          } else {
            views.views[idDate].views++;
          }

          // additionner toutes les vues
          const allVues = (views.days).reduce(function (acc, obj) { return acc + obj.views; }, 0);

          // update dans le db
          this._infosService.updateViews(month, { month: month, year:year, views: JSON.stringify(views), views_month: allVues }).subscribe();
        }
      }
    })

  }
  get modalIsOpen(): boolean {
    return this._modalService.isOpen;
  }

}
