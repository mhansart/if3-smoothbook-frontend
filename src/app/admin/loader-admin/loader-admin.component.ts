import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-admin',
  templateUrl: './loader-admin.component.html',
  styleUrls: ['./loader-admin.component.scss']
})
export class LoaderAdminComponent implements OnInit {
  h:number = window.innerHeight;
  constructor() { }

  ngOnInit(): void {
    
  }
  onResize(event) {
    this.h = window.innerHeight;
  }

}
