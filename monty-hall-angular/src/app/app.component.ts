import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'monty-hall-angular';
  prizedDoor = Math.floor((Math.random() * 3) + 1);
  showPrizeDoor = false;
  selectedDoor = 0;
  openDoors:number[] = []
  result = ''
  ngOnInit(): void {
    this.reset();
  }
  toggleAnswerDisplay() {
    console.log(this.prizedDoor);
    this.showPrizeDoor = !this.showPrizeDoor;
  }

  reset() {
    this.prizedDoor = Math.floor((Math.random() * 3) + 1);
    this.showPrizeDoor = false;
    this.selectedDoor = 0;
    this.openDoors = [];
    this.result = '';
  }
  selectDoor(userChoice:number){
    this.selectedDoor = userChoice;
    console.log("user selected "+ this.selectedDoor)
  }

  openInvalidDoor() {
    if (this.selectedDoor === 0) {
      console.log("Please select a door before opening an invalid one!");
      return;
    }

    if (this.openDoors.length > 0) {
      console.log("Unable to open more doors as per the rules configured!");
      return;
    }
    var doorsArray: number[] = [1, 2, 3]
    .filter(item => item !== this.prizedDoor)
    .filter(item => item!== this.selectedDoor);
    const doorToBeOpened: number = doorsArray[Math.floor(Math.random() * doorsArray.length)];
    console.log ("open door :" + doorToBeOpened);
    this.openDoors.push(doorToBeOpened);
  }
  switchSelectedDoor() {
    if (this.selectedDoor === 0) {
      console.log("Please select a door first");
      return;
    }
    var doorsArray: number[] = [1, 2, 3]
    .filter(item => item !== this.openDoors[0])
    .filter(item => item!== this.selectedDoor);
    this.selectDoor(doorsArray[0]);
  }

  seeResults() {
    this.openDoors.push(1);
    this.openDoors.push(2);
    this.openDoors.push(3);
    this.result = this.selectedDoor == this.prizedDoor ? 'Congratulations you won' :'Better luck next time';
    this.selectedDoor = 0;
    
  }

  automate() {
    let totalWins = 0;
    for (let i=0; i<10000; i++) {
      this.reset();
      let selectedDoor = Math.floor((Math.random() * 3) + 1);
      this.selectDoor(selectedDoor);
      let won = this.selectedDoor == this.prizedDoor;
      console.log ("Prize door : " + this.prizedDoor 
                  + " :: selected door : " + selectedDoor 
                  + " :: switched? : false"
                  + " :: won ? :" + won);
      if (won) {
        totalWins ++;
      }
    }
    console.log("Without switching - you won " + totalWins + " games out of total 10000 games")
    
  }
}
