import { Component, OnInit } from '@angular/core';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent implements OnInit {

  urlImg: string = environment.imgUrl;
  allImg:{picture:string,orientation:string}[]=[];
  idImg:number;
  h:number;
  w:number;


  constructor(private _modalService: ModalImageService) { }

  ngOnInit(): void {
    this.allImg = this.array;
    this.idImg = this.id;
  }
  closeModal() {
    this._modalService.closeModal();
  }
  toLeft(){
    
    if(this.id == 0){
      this._modalService.id = this.allImg.length-1;
    }else{
      this._modalService.id-=1;
    }
  }
  toRight(){
    if(this.id == this.allImg.length-1){
      this._modalService.id = 0
    }else{
      this._modalService.id+=1;
    }
  }

  get array(): {picture:string,orientation:string}[] {
    return this._modalService.array;
  }
  get id(): number {
    return this._modalService.id;
  }

}
