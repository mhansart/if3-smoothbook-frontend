import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  isOpen: boolean = false;
  response: boolean;
  isOpenChange: Subject<boolean> = new Subject<boolean>();
  onClose: Subject<boolean> = new Subject<boolean>();
  name: string = "";

  constructor() {
    this.isOpenChange.subscribe((value) => {
      this.isOpen = value
    });
  }
  toggle(){
    this.isOpenChange.next(!this.isOpen);
  }
  closeModal(data:boolean){
      this.toggle();
      this.onClose.next(data);
      
  }
  openModal(name: string) {
      this.toggle();
      this.name = name;
      this.onClose.observers = [];
  }
}
