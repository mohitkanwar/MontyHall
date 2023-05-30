import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Door } from './door';
import { animate, style, transition, trigger } from '@angular/animations';

class Row {
  initiallySelectedDoor!: number;
  winningDoor!: number;
  switched!: boolean;
  result!: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition('* => *', [
        style({ opacity: 0 }), // Initial state
        animate('500ms', style({ opacity: 1 })) // Transition to visible state
      ])
    ])
  ]
})
export class AppComponent implements OnInit{
  
  title = 'monty-hall-angular';
  prizedDoor = Math.floor(Math.random() * 3);
  showPrizeDoor = false;
  doors:Door[] = []
  result = ''
  openAllDoors = false;
  selectedDoor: number = -1;
  state =''
  summary: string = '';
  errorMessage = ''
  invalidDoorOpened = false;
  invalidOpenedDoorNumber = -1;
  message = '';
  action = null;
  rowData :Row[]= []
  @ViewChild('messageContainer')
  messageContainer!: ElementRef;
  @ViewChild('summary')
  summaryElement!: ElementRef;
  isLoading = false;
  ngOnInit(): void {
    this.reset();
  }
  toggleAnswerDisplay() {
    console.log(this.prizedDoor);
    this.showPrizeDoor = !this.showPrizeDoor;
  }

  reset = () => {
    this.prizedDoor = Math.floor(Math.random() * 3);
    this.showPrizeDoor = false;
    this.openAllDoors = false;
    this.result = '';
    this.doors = [];
    this.selectedDoor = -1;
    this.invalidDoorOpened = false;
    this.invalidOpenedDoorNumber = -1;
    for (let i=0; i<3; i++) {
      let door = new Door();
        door.close();
        door.isSelected = false;
        door.isWinning = i == this.prizedDoor;
        door.position = i;
        this.doors.push(door);
    }
    this.state = 'initialized'
  }
  onDoorSelection(event : {'door-position' : number}){
    if (!this.openAllDoors) {
      console.log("user selected " + event['door-position'])
      this.doors.forEach ((door) => {
        if (door.position !== event['door-position']) {
          door.isSelected = false;
        } else {
          door.isSelected = true;
          this.selectedDoor = event['door-position'];
        }
      });
      this.state = 'door-selected';
      this.stateMessageMapping['door-selected'].message = 'Great! You have chosen door number <b>' + (this.selectedDoor + 1)+ '</b>. Based on probability, the chances of the prize being behind this door is 1/3, while the combined probability of the prize being behind the other two doors is 2/3. <br> Now, let\'s proceed to open a door that does not have the prize.';
    }
    this.scrollToElement();
  }

  openInvalidDoor = () =>  {
    console.log("opening an invalid door")
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
    this.invalidDoorOpened = true;
    this.invalidOpenedDoorNumber = doorToBeOpened.position;
    this.state = 'invalid-door-opened';
    this.scrollToElement();
  }
  switchSelectedDoor = () => {

    let selectedDoor = this.doors
    .filter(item => item.state !== 'open')
    .filter(item => !item.isSelected)[0];
    
    this.doors.forEach((door) => door.isSelected = false);
    selectedDoor.isSelected = true;
    this.state = 'switched-selected-doors';
    this.scrollToElement();
  }
  seeResults = ()  => {
    this.openAllDoors = true;
    let won = false;
    this.doors.forEach((door) => {
      if (door.isSelected && door.isWinning) {
        console.log ("Congrats you won!")
        this.state = 'win'
        won = true;
      }
      door.open();
    });
    
    if (!won) {
      this.state = 'lose'
      console.log("Better luck next time!");
    }
    this.scrollToElement();
  }
  stateMessageMapping :{[state : string]: { message: string; action: () => void; actionName: string; action2: () => void; action2Name: string;}} = {
    'initialized' : 
      { 
        message:'Go ahead and select a door by clicking on it',
        action: () => {},
        actionName: '',
        action2: () => {},
        action2Name: ''
      } ,
      'door-selected' :
      { 
        message: '',
        action: this.openInvalidDoor,
        actionName: 'Open an Invalid Door',
        action2: () => {},
        action2Name: ''
      },
      'invalid-door-opened' :
      { 
        message: `<p>
        Here's the counter-intuitive aspect of the situation: On the screen, you see three doors.
       </p>
        <ol>
         <li>The door you initially selected, which may or may not have the prize.</li>
         <li>The door that has been opened, revealing that it doesn't have the prize.</li>
         <li>The remaining door that you haven't selected, which may or may not have the prize.</li>
       </ol>
       <p>At this point, it may seem like the two closed doors have an equal probability of containing the prize, making it a 50% chance for each door. However, it's important to note that the probability was determined when the prizes were placed behind the doors, and that hasn't changed. The additional information we now have is that the opened door doesn't have the prize.</p>
       <p>This means that the door you initially selected had a 1/3 chance of winning and a 2/3 chance of losing. In the scenarios where your chosen door was losing, the other two doors were winning. But now, all of that probability has shifted to the one unopened door. Therefore, from a probability standpoint, it is better to switch doors at this stage. </p>
       <p>Would you like to switch?</p>
     `,
        action: this.switchSelectedDoor,
        actionName: 'Switch your selected door',
        action2: this.seeResults,
        action2Name: 'Nah, I trust my intuitions'
      },
      'switched-selected-doors' : { 
        message: 'Great! you have opted for higher probability leaving behind your intuitions.',
        action: this.seeResults,
        actionName: 'Show Results',
        action2: () => {},
        action2Name: ''
      },
      'win' : 
      { 
        message:'Congratulations! you won!',
        action: this.reset,
        actionName: 'Play Again',
        action2: () => {},
        action2Name: ''
      } ,
      'lose' : 
      { 
        message:'Better luck next time!',
        action: this.reset,
        actionName: 'Play Again',
        action2: () => {},
        action2Name: ''
      } ,

  }
  



  automate() {
    this.isLoading = true;
    this.rowData = [];
    let totalWins = 0;
    for (let i=0; i<10000; i++) {
      this.reset();
      let selectedDoor = Math.floor(Math.random() * 3);
       this.onDoorSelection({'door-position' : selectedDoor});
       let won = this.selectedDoor == this.prizedDoor;
      let game:Row = new Row();
      game.initiallySelectedDoor = selectedDoor;
      game.result = won? 'won' : 'lost';
      game.switched = false;
      game.winningDoor = this.prizedDoor;
      this.rowData.push(game);
      if (won) {
        totalWins ++;
      }
      
    }
    this.isLoading = false;
    this.summary = "Without switching - you won " + totalWins + " games out of total 10000 games.";
    this.summary += "i.e. you won" + (totalWins/100) + "% of times";
    
  }

  popupClosed(event : {}) {
    this.state= '';
  }

  scrollToElement() {
    this.messageContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
