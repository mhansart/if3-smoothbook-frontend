import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/models/pages.model';
import { InfositeService } from 'src/app/services/infosite.service';
import { PagesService } from 'src/app/services/pages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbarsite',
  templateUrl: './navbarsite.component.html',
  styleUrls: ['./navbarsite.component.scss']
})
export class NavbarsiteComponent implements OnInit {
  isActive:string;
  pages : Page[] =[];
  pagesSubscription:Subscription;
  logo:string='60.png';
  urlImg:string = environment.imgUrl;
  h = window.innerHeight;
  w = window.innerWidth;
  menuClosed: boolean = false;
  constructor(private _pagesService : PagesService, private _router:Router, private _infosService : InfositeService) { }

  ngOnInit(): void {
    this.menuClosed = this.w < 992 ? true : false;

    this._pagesService.getPages().subscribe(
      (pages:Page[]) =>{
        this.pages = pages.filter((x)=> {return x.active === "1"});
      })
      this.isActive = (this._router.url).substr(1,this._router.url.length)
      this._infosService.getInfos().subscribe(
        (data) =>{
          this.logo = (data.filter((x)=> x.infos_name == "logo"))[0].infos_value;
        })
        
  }
  navigateTo(route:string){
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
   this._router.navigate([route]));
  }
  closeMenu(){
    const burger = document.querySelector('.menu-burger-site');
    burger.classList.toggle('cross-menu');
    const menu = document.querySelector('.nav-site');
    if(menu.classList.contains('menu-closed-site')){
      menu.classList.remove('menu-closed-site');
    }else{
      menu.classList.add('menu-closed-site');
    }

  }
  onResize(event) {
    this.h = window.innerHeight;
    if (window.innerWidth <= 768) {
      this.menuClosed = true;
    }else{
      this.menuClosed = false;
    }

  }
}
