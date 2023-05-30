import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spoiler',
  templateUrl: './spoiler.component.html',
  styleUrls: ['./spoiler.component.css'],
  animations: [
    trigger('toggleContent', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0, height: '0' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class SpoilerComponent implements OnInit {

  constructor() { }
  @Input() prizedDoor!:number;
  ngOnInit(): void {
  }
  showContent: boolean = false;

  toggleContent() {
    this.showContent = !this.showContent;
  }
}
