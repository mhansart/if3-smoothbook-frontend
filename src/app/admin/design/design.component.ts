import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Infos } from 'src/app/models/infossite.model';
import { ImageService } from 'src/app/services/image.service';
import { InfositeService } from 'src/app/services/infosite.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  siteName: Infos[] = [];
  favicon: Infos[] = [];
  logo: Infos[] = [];
  imgFav: File;
  imgLogo: File;
  actualFont: Infos[] = [];
  fg: FormGroup;
  src: string | ArrayBuffer | SafeResourceUrl;
  srcLogo: string | ArrayBuffer | SafeResourceUrl;
  errorMessage: string;
  theme = [{
    color_theme: "theme-1",
    primary_color: "#1E4040",
    secondary_color: "#80f5a3"
  },
  {
    color_theme: "theme-2",
    primary_color: "#A63C3C",
    secondary_color: "#D9AA8F"
  },
  {
    color_theme: "theme-3",
    primary_color: "#025E73",
    secondary_color: "#B8D5D9"
  },
  {
    color_theme: "theme-4",
    primary_color: "#052940",
    secondary_color: "#F2D680"
  }]
  fonts = [{
    font_theme: "fonts-1",
    title_font: "'Roboto', sans-serif",
    content_font: "'Ubuntu', sans-serif"
  },
  {
    font_theme: "fonts-2",
    title_font: "'Raleway', sans-serif",
    content_font: "'Montserrat', sans-serif"
  },
  {
    font_theme: "fonts-3",
    title_font: "'Oswald', sans-serif",
    content_font: "'Mukta Vaani', sans-serif"
  },
  {
    font_theme: "fonts-4",
    title_font: "'Source Serif Pro', serif",
    content_font: "'Source Sans Pro', sans-serif"
  }]

  constructor(private _infosService: InfositeService,
    private _formBuilder: FormBuilder, private _router: Router, private _imageService: ImageService,
    private _sanitizer: DomSanitizer) {
      document.getElementById('loader-admin').style.display="flex"
     }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function(){ document.getElementById('loader-admin').style.display="none" }, 1000);

    // responsive menu
    if (window.innerWidth < 992) {
      const menu = document.querySelector('header');
      if(!menu.classList.contains('menu-closed')) menu.classList.add('menu-closed');
      const burger = document.querySelector('.menu-burger');
    burger.classList.remove('cross-menu');
    }

    this.fg = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      color: ['', Validators.required],
      sitename: ['', Validators.required],
      logo: ['', Validators.required],
      favicon: ['', Validators.required],
      font: ['', Validators.required]

    })

    // On va rechercher toutes les infos dans le tableau pour afficher les valeurs dans le form
    this._infosService.getInfos().subscribe(data => {
      const theme = data.filter((x) => { return x.infos_name == "color_theme" });
      this.siteName = data.filter((x) => { return x.infos_name == "title_name" });
      this.favicon = data.filter((x) => { return x.infos_name == "favicon_image" });
      this.logo = data.filter((x) => { return x.infos_name == "logo" });
      this.actualFont = data.filter((x) => { return x.infos_name == "font_theme" });
      this.src = `${environment.imgUrl}/${this.favicon[0].infos_value}`;
      this.srcLogo = `${environment.imgUrl}/${this.logo[0].infos_value}`;
      this.fg.setValue({ color: theme[0].infos_value, sitename: this.siteName[0].infos_value, logo: '', favicon: '', font: this.actualFont[0].infos_value });
    }
    );
  }

  // Lorsqu'on valide les changements
  onSubmit() {
    const choosenTheme = this.theme.filter((x) => {
      return x.color_theme == this.fg.value['color'];
    })
    const choosenFonts = this.fonts.filter((x) => {
      return x.font_theme == this.fg.value['font'];
    })
    const thisLogo = this.imgLogo == undefined? this.logo[0].infos_value : `logo-menu-${this.imgLogo.name}`;
    const newTheme = [
      { infos_name: "color_theme", infos_value: choosenTheme[0].color_theme },
      { infos_name: "primary_color", infos_value: choosenTheme[0].primary_color }, { infos_name: "secondary_color", infos_value: choosenTheme[0].secondary_color }, { infos_name: "title_name", infos_value: this.fg.value["sitename"] },
      { infos_name: "font_theme", infos_value: this.fg.value["font"] },
      { infos_name: "content_font", infos_value: choosenFonts[0].content_font },
      { infos_name: "title_font", infos_value: choosenFonts[0].title_font },
      { infos_name: "logo", infos_value: thisLogo }
    ];

    // Enregistrement du logo et du favicon dans uploads
    if (this.fg.value["logo"] !== '') {
      const formData = new FormData();
      formData.append('file', this.imgLogo);
      this._imageService.uploadLogo(formData).subscribe(
        (res) => res,
        (err) => err
      );
    }
    if (this.fg.value["favicon"] !== '') {
      const formData = new FormData();
      formData.append('file', this.imgFav);
      this._imageService.uploadFavicon(formData).subscribe(
        (res) => res,
        (err) => err
      );
    }
    // Update de la database
    newTheme.forEach((x) => {
      this._infosService.updateInfos(x).subscribe({
        next: () => {
          window.location.reload();
        },
        error: error => {
          this.errorMessage = error;
        }
      })
    })
  }

  // Afficher les images directement après le téléchargement
  onSelectFile(event, str: string) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      if (str === 'favicon') {
        this.imgFav = event.target.files[0];
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.src = this._sanitizer.bypassSecurityTrustResourceUrl((event.target.result).toString());
        }
      } else {
        this.imgLogo = event.target.files[0];
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.srcLogo = this._sanitizer.bypassSecurityTrustResourceUrl((event.target.result).toString());
        }
      }
    }
  }


}
