import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(250)]),
      transition(':leave', [animate(250, style({ height: 0 }))]),
    ]),
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  h = window.innerHeight;
  w = window.innerWidth;
  menuClosed: boolean = false;

  constructor() { }
  pageMasked: boolean = true;
  postMasked: boolean = true;
  designMasked: boolean = true;

  ngOnInit(): void {
    this.menuClosed = this.w < 992 ? true : false;
    const main = document.getElementById('main-admin');
    main.style.paddingLeft = this.menuClosed ? "0px" : "250px";
  }
  closeMenu() {
    this.w = window.innerWidth;
    this.menuClosed = !this.menuClosed;
    if (this.w > 992) {
      const main = document.getElementById('main-admin');
      main.classList.toggle('menu-is-closed');
      main.style.paddingLeft = this.menuClosed ? "0px" : "250px";
    }
  }
  onResize(event) {
    this.h = window.innerHeight;
    const main = document.getElementById('main-admin');
    if (window.innerWidth <= 992) {
      
      main.style.paddingLeft = "0px";
      main.classList.add('menu-is-closed');
      this.menuClosed = true;

    }else{
      main.style.paddingLeft = "250px";
      this.menuClosed = false;
      main.classList.remove('menu-is-closed');

    }

  }
}
