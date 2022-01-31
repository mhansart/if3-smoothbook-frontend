import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  h:number = window.innerHeight;
  constructor() { }

  ngOnInit(): void {
  }
  onResize(event) {
    this.h = window.innerHeight;
  }

}
