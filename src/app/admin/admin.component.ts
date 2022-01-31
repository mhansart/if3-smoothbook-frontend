import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  modalOpen: boolean;
  constructor(private _modalService: ModalService, private titleService: Title) { }

  ngOnInit(): void {
    this.setTitle('SmoothBook');
    this.modalOpen = this._modalService.isOpen;
  }
  get modalIsOpen(): boolean {
    return this._modalService.isOpen;
  }
  closeMenu() {
    const burger = document.querySelector('.menu-burger');
    burger.classList.toggle('cross-menu');
    const menu = document.querySelector('header');
    if (menu.classList.contains('menu-closed')) {
      menu.classList.remove('menu-closed');
    } else {
      menu.classList.add('menu-closed');
    }

  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
