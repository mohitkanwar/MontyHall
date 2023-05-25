import { Component, OnInit } from '@angular/core';
import { Door } from './door';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'monty-hall-angular';
  prizedDoor = Math.floor(Math.random() * 3);
  showPrizeDoor = false;
  doors:Door[] = []
  result = ''
  openAllDoors = false;

  ngOnInit(): void {
    this.reset();
  }
  toggleAnswerDisplay() {
    console.log(this.prizedDoor);
    this.showPrizeDoor = !this.showPrizeDoor;
  }

  reset() {
    this.prizedDoor = Math.floor(Math.random() * 3);
    this.showPrizeDoor = false;
    this.openAllDoors = false;
    this.result = '';
    this.doors = [];
    for (let i=0; i<3; i++) {
      let door = new Door();
        door.close();
        door.isSelected = false;
        door.isWinning = i == this.prizedDoor;
        door.position = i;
        this.doors.push(door);
    }
  }
  onDoorSelection(event : {'door-position' : number}){
    if (!this.openAllDoors) {
      console.log("user selected " + event['door-position'])
      this.doors.forEach ((door) => {
        if (door.position !== event['door-position']) {
          door.isSelected = false;
        }
      });
    }
    
  }

  openInvalidDoor() {
    if (this.doors.filter(door => door.isSelected).length === 0) {
      console.log("Please select a door before opening an invalid one!");
      return;
    }

    if (this.doors.filter(door => door.state == 'open').length > 0) {
      console.log("Unable to open more doors as per the rules configured!");
      return;
    }
    let doorsArray = this.doors
    .filter(item => !item.isWinning)
    .filter(item => !item.isSelected);
    const doorToBeOpened: Door = doorsArray[Math.floor(Math.random() * doorsArray.length)];
    console.log ("open door :" + doorToBeOpened.position);
    this.doors[doorToBeOpened.position].open();
  }
  switchSelectedDoor() {

    let selectedDoor = this.doors
    .filter(item => item.state !== 'open')
    .filter(item => !item.isSelected)[0];
    
    this.doors.forEach((door) => door.isSelected = false);
    selectedDoor.isSelected = true;
  }

  seeResults() {
    this.openAllDoors = true;
    let won = false;
    this.doors.forEach((door) => {
      if (door.isSelected && door.isWinning) {
        console.log ("Congrats you won!")
        won = true;
      }
      door.open();
    });
    
    if (!won) {
      console.log("Better luck next time!");
    }
  }

  automate() {
    let totalWins = 0;
    for (let i=0; i<10000; i++) {
      this.reset();
      let selectedDoor = Math.floor(Math.random() * 3);
      // this.selectDoor(selectedDoor);
      // let won = this.selectedDoor == this.prizedDoor;
      // console.log ("Prize door : " + this.prizedDoor 
      //             + " :: selected door : " + selectedDoor 
      //             + " :: switched? : false"
      //             + " :: won ? :" + won);
      // if (won) {
      //   totalWins ++;
      // }
    }
    console.log("Without switching - you won " + totalWins + " games out of total 10000 games")
    
  }
}
