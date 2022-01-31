import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr'
import { ViewsSite } from 'src/app/models/viewsSite.model';

import { InfositeService } from 'src/app/services/infosite.service';
import { PagesService } from 'src/app/services/pages.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  views: ViewsSite[] = [];
  dateMonth = [];
  month = moment().month();
  monthStr = moment().format('MMMM');
  monthViews: number = 0;
  allViews: number = 0;
  mostDay = [];
  year = moment().year();
  actualMonth: number = this.month;
  actualYear: number = this.year;
  mostVisited = [];
  mostVisitedPage=[];
  mostVisitedPost=[];
  localStorage = JSON.parse(localStorage.getItem('adminIs'));
  firstname = this.localStorage.firstname;
  name = this.localStorage.name;



  constructor(private _infosService: InfositeService, private _pageService:PagesService, private _postsService:PostsService) { document.getElementById('loader-admin').style.display = "flex" }

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
    // aller chercher les analytics
    this._infosService.getViews().subscribe(data => {
      this.views = data;
      this.allViews = this.views.reduce(function (acc, obj) { return acc + obj.views_month; }, 0);
      this.infosMonth(this.actualMonth, this.actualYear);
    })
  }
  dayString(day: number) {
    if (day == 0) {
      return "Lundi";
    }
    if (day == 1) {
      return "Mardi";
    }
    if (day == 2) {
      return "Mercredi";
    }
    if (day == 3) {
      return "Jeudi";
    }
    if (day == 4) {
      return "Vendredi";
    }
    if (day == 5) {
      return "Samedi";
    }
    if (day == 6) {
      return "Dimanche";
    }
  }

  // change month
  infosMonth(month: number, year: number) {
    moment().locale('fr');

    // all days of the month
    var startOfMonth = moment([year, month, 1]);
    this.monthStr = moment(startOfMonth).format('MMMM');
    var endOfMonth = moment(startOfMonth).endOf('month');
    for (let i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
      this.dateMonth.push({ date: startOfMonth.format('l'), str: `${startOfMonth.date()}`, day: startOfMonth.day() });
      startOfMonth.add(1, 'days');
    }
    // views of the month (general)
    const viewThisMonth = this.views.filter((x) => { return x.month == month });
    const viewByDate = viewThisMonth[0] ?  JSON.parse(viewThisMonth[0].views).views : [];
    this.mostVisited = Math.max.apply(Math, viewByDate.map(o => o?.views));
    const onlyDays = [];
    this.views.forEach((x) => {
      const viewsByDay = JSON.parse(x?.views).days;
      viewsByDay.forEach((y, i) => {
        onlyDays[i] = onlyDays[i] == null ? y?.views : onlyDays[i] + y?.views;
      })
    })

    // day with most views (general)
    this.mostDay = onlyDays.map((x, i) => { if (x == Math.max(...onlyDays)) return i })
      .filter((x) => x !== undefined).map((x) => { return this.dayString(x) });

    // add views by date
    viewByDate.forEach((x) => {
      const day = x.date.split('/')[0];
      this.dateMonth[Number(day) - 1] = { ...this.dateMonth[Number(day) - 1], views: x?.views };
      this.monthViews = viewThisMonth[0]?.views_month;
    })
    // views pages
    this._pageService.getPages().subscribe(data =>{
      const viewsPage = data.map((x)=> { return {...x,views:JSON.parse(x?.views).filter((y)=> {return y.month == month && y.year == year})}});
      const onlyViewsPage = viewsPage.map((x)=> { return x.views[0]?.views}).filter((x)=> { return x!== undefined});
      this.mostVisitedPage = viewsPage.filter((x)=> { return x.views[0]?.views == Math.max(...onlyViewsPage)});
    })

    // views posts
    this._postsService.GetPosts().subscribe(data =>{
      const viewsPost = data.map((x)=> { return {...x,views:JSON.parse(x?.views).filter((y)=> {return y.month == month && y.year == year})}});
      const onlyViewsPost = viewsPost.map((x)=> { return x.views[0]?.views}).filter((x)=> { return x!== undefined});
      this.mostVisitedPost = viewsPost.filter((x)=> { return x.views[0]?.views == Math.max(...onlyViewsPost)});
    })
  }

  // previous or next month
  changeMonth(str: string) {
    this.dateMonth = [];
    if (str === "left") {
      this.actualYear = this.actualMonth == 0 ? this.actualYear - 1 : this.actualYear;
      this.actualMonth = this.actualMonth == 0 ? 11 : this.actualMonth - 1;
      this.infosMonth(this.actualMonth, this.actualYear);
    }
    if (str === "right") {
      this.actualYear = this.actualMonth == 11 ? this.actualYear + 1 : this.actualYear;
      this.actualMonth = this.actualMonth == 11 ? 0 : this.actualMonth + 1;
      this.infosMonth(this.actualMonth, this.actualYear);
    }
  }
}
