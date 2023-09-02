import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bottombar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.scss']
})
export class BottombarComponent {
  @Input() selectedColorIndex: number = 0;
  @Input() colors: number[] = [];
  @Output() changeSelectedColorIndex = new EventEmitter<number>();

  constructor() {
    console.log(this.colors)
  }

  changeSelectedColor(index: number){
    this.changeSelectedColorIndex.emit(index);
  }
}
