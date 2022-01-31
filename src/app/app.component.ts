import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Infos } from './models/infossite.model';
import { InfositeService } from './services/infosite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  infos: Infos[] = []


  public constructor(private _infosService: InfositeService,) { 
  }

  ngOnInit(): void {
    this._infosService.getInfos().subscribe(data => {
      if(data){
        const primaryColor = data.filter((x) => x.infos_name === "primary_color");
        const secondaryColor = data.filter((x) => x.infos_name === "secondary_color");
        const titleFont = data.filter((x) => x.infos_name === "title_font");
        const contentFont = data.filter((x) => x.infos_name === "content_font");
        document.documentElement.style
          .setProperty('--primary-color-site', primaryColor[0].infos_value);
        document.documentElement.style
          .setProperty('--secondary-color-site', secondaryColor[0].infos_value);
        document.documentElement.style
          .setProperty('--font-title-site', titleFont[0].infos_value);
        document.documentElement.style
          .setProperty('--font-content-site', contentFont[0].infos_value);
      }

    })


  }

  
}
