import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Door } from '../door';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.css']
})
export class DoorComponent implements OnInit {

  constructor() { }
  @Input() door!: Door;
  @Output() selectionEvent = new EventEmitter();
  ngOnInit(): void {
  }
  toggleSelection(){
    this.door.isSelected = !this.door.isSelected;
    this.selectionEvent.emit({'door-position' : this.door.position});
  }
}
