import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {


  constructor(private _modalService:ModalService) { }

  ngOnInit(): void {
  }
  get name(): string {
    return this._modalService.name;
  }
  yes(){this._modalService.closeModal(true)
  }
  no(){this._modalService.closeModal(false)}

}
