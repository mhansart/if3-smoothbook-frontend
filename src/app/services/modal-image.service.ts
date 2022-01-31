import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {
  isOpen: boolean = false;
  isOpenChange: Subject<boolean> = new Subject<boolean>();
  array: {picture:string,orientation:string}[] = [];
  id: number;

  constructor() {
    this.isOpenChange.subscribe((value) => {
      this.isOpen = value
    });
  }
  toggle() {
    this.isOpenChange.next(!this.isOpen);
  }
  closeModal() {
    this.toggle();
    this.array = [];
    this.id = null;
  }

  openModal(arr: {picture:string,orientation:string}[], id: number) {
    this.toggle();
    this.array = arr;
    this.id = id;
  }
}
