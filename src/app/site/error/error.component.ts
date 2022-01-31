import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  h: number;
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.setTitle(`Erreur 404` );
    // fermer le loader
    document.getElementById('loader-site').style.display="none"
    this.h = window.innerHeight - 35;
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
