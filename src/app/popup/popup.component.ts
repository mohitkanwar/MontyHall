import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() message!: string;
  @Input() isVisible = false;
  @ViewChild('popupContent') popupContent!: ElementRef;
  @Output() popupCloseEvent = new EventEmitter();
  private isDragging: boolean = false;
  private initialX: number = 0;
  private initialY: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  closePopup() {
    this.popupCloseEvent.emit({'close-popup': this.id})
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.initialX = event.clientX - this.popupContent.nativeElement.offsetLeft;
    this.initialY = event.clientY - this.popupContent.nativeElement.offsetTop;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const offsetX = event.clientX - this.initialX;
      const offsetY = event.clientY - this.initialY;
      this.popupContent.nativeElement.style.left = offsetX + 'px';
      this.popupContent.nativeElement.style.top = offsetY + 'px';
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

}
