import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { newPage } from 'src/app/models/newpage.model';
import { Page } from 'src/app/models/pages.model';
import { ImageService } from 'src/app/services/image.service';
import { ModalService } from 'src/app/services/modal.service';
import { PagesService } from 'src/app/services/pages.service';
import { environment } from 'src/environments/environment';
import * as ClassicEditor from '../../../ckeditor';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.scss']
})
export class AddpageComponent implements OnInit {
  fg: FormGroup;
  errorMessage: string;
  public Editor = ClassicEditor;
  newContent: (string[])[];
  allUrl: (string | ArrayBuffer)[] = [];
  url: string | ArrayBuffer;
  multipleImage: (File | any)[] = [];
  newpage: newPage;
  thiscontent: string[];
  updatePage: boolean = false;
  updatedPage: Page[] = [];
  updatedContent = [];
  eventSubscription: Subscription;
  constructor(private _formBuilder: FormBuilder, private _pageService: PagesService, private _router: Router, private _imageService: ImageService, private _route: ActivatedRoute, private _modalService: ModalService) { document.getElementById('loader-admin').style.display = "flex" }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function () { document.getElementById('loader-admin').style.display = "none" }, 1000);


    // responsive du menu
    if (window.innerWidth < 992) {
      const menu = document.querySelector('header');
      if (!menu.classList.contains('menu-closed')) menu.classList.add('menu-closed');
      const burger = document.querySelector('.menu-burger');
      burger.classList.remove('cross-menu');
    }

    // vérifier si c'est un ajout ou une modification
    if (this._route.snapshot.params['id']) {
      this.updatePage = true;
    }

    // initialiser le formgroup
    this.fg = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      name: ['', Validators.required],
      type: ['', Validators.required],
      route: ['', Validators.required],
      content: this._formBuilder.array([])
    })

    // Si c'est une modification de page, on va rechercher les infos de la page et on les passe en valeur du formgroup
    if (this.updatePage) {
      this._pageService.getById(this._route.snapshot.params['id']).subscribe(data => {
        this.updatedPage = data;
        this.updatedContent = JSON.parse(data[0].content);
        this.fg.patchValue({ name: data[0].name, type: data[0].type, route: data[0].route, content: this.updatedContent });
        (JSON.parse(data[0].content)).forEach((x, i) => {
          this.allUrl[i] = x.type.includes('image') ? `${environment.imgUrl}/${x.image}` : '';
          this.multipleImage[i] = '';
          if (x.image) {
            x.image = '';
          }
          this.getcontent().push(this._formBuilder.group(x));
        })
      });
    }
  }

  // lorsque l'on valide l'ajout ou la modification
  onSubmit() {
    this.newContent = [];
    this.fg.value['content'].forEach((x, i) => {
      this.thiscontent = [];

      // Si il y a une image dans le bloc, on va chercher le nom de l'image dans le tableau multipleImage (ou si modif, dans le tableau updatedContent)
      if (x.image !== null) {
        if (this.updatePage && !this.multipleImage[i]) {
          this.thiscontent = { ...x, image: this.updatedContent[i].image }
        } else {
          this.thiscontent = { ...x, image: this.multipleImage[i].name }
        }
      } else {
        this.thiscontent = { ...x };
      }
      this.newContent.push(this.thiscontent);
    })

    // Envoyer les images vers le serveur pour les enregistrer dans uploads
    const formData = new FormData();
    for (let img of this.multipleImage) {
      formData.append('files', img);
    }
    this._imageService.uploadImage(formData).subscribe();

    // Si c'est une modification de page
    if (this.updatePage) {
      // On remet l'active comme il était puis on envoie à l'api en transformant le tableau content en JSON
      this.newpage = { ...this.fg.value, content: JSON.stringify(this.newContent), active: this.updatedPage[0].active };
      this._pageService.updatePage(this.newpage, this._route.snapshot.params['id']).subscribe({
        next: () => {
          this._router.navigate(['/adminafg/optionpages']);
        },
        error: error => {
          this.errorMessage = error;
          console.log(error);
        }
      })

      // Si c'est un ajout
    } else {
      // On envoie le tout à l'api en transformant content en json et en initialisant active à 1
      this.newpage = { ...this.fg.value, content: JSON.stringify(this.newContent), active: 1 }
      this._pageService.addPage(this.newpage).subscribe({
        next: () => {
          this._router.navigate(['/adminafg/optionpages']);
        },
        error: error => {
          this.errorMessage = error;
          console.log(error);
        }
      })
    }
  }

  // Aller rechercher les objets de 'content'
  getcontent() {
    return this.fg.get('content') as FormArray;
  }

  // Ajouter de nouveaux objets à content, en fonction du bloc choisi
  addcontent(val: string) {
    this.allUrl.push("");
    this.multipleImage.push("");
    let newContentControl;
    if (val === "text") {
      newContentControl = this._formBuilder.group({
        type: "text",
        text: ['', Validators.required],
        image: [undefined]
      })
    }
    if (val === "text-image") {
      newContentControl = this._formBuilder.group({
        type: "text-image",
        text: ['', Validators.required],
        image: ['', Validators.required]
      })
    }
    if (val === "image-text") {
      newContentControl = this._formBuilder.group({
        type: "image-text",
        image: ['', Validators.required],
        text: ['', Validators.required]
      })
    }
    if (val === "image") {
      newContentControl = this._formBuilder.group({
        type: "image",
        image: ['', Validators.required],
        text: [undefined],
      })
    }
    if (val === "bloc-text") {
      newContentControl = this._formBuilder.group({
        type: "bloc-text",
        text: ['', Validators.required],
        image: [undefined],
      })
    }
    this.getcontent().push(newContentControl);
  }

  // Supprimer un bloc -> ouvrir la modal pour confirmer
  deleteBlock(idx: number) {
    this._modalService.openModal(`supprimer ce paragraphe`);
    this._modalService.onClose.subscribe(data => {
      if (data) {
        // On passe dans tous les tableaux pour supprimer le bloc
        this.getcontent().controls = this.getcontent().controls.filter((x, i) => { return i != idx });
        this.multipleImage = this.multipleImage.filter((x, i) => { return i !== idx });
        this.fg.value['content'] = this.fg.value['content'].filter((x, i) => { return i != idx });
        if (this.updatePage) {
          this.updatedContent = this.updatedContent.filter((x, i) => { return i != idx });
        }
        this.allUrl = this.allUrl.filter((x, i) => { return i != idx });
      }
    })
  }

  // Afficher l'image dans la div et enregistrer la valeur du File dans le tableau multipleImage
  onSelectFile(event, i) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      this.multipleImage[i] = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.allUrl[i] = event.target.result;
      }
    }
  }

}
