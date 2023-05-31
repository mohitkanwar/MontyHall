import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Door as Gate } from './door';
import { animate, style, transition, trigger } from '@angular/animations';

class Row {
  initiallySelectedGate!: number;
  winningGate!: number;
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
  prizedGate = Math.floor(Math.random() * 3);
  showPrizeGate = false;
  gates:Gate[] = []
  result = ''
  openAllGates = false;
  selectedGate: number = -1;
  state =''
  summary: string = '';
  errorMessage = ''
  invalidGateOpened = false;
  invalidOpenedGateNumber = -1;
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
    console.log(this.prizedGate);
    this.showPrizeGate = !this.showPrizeGate;
  }

  reset = () => {
    this.prizedGate = Math.floor(Math.random() * 3);
    this.showPrizeGate = false;
    this.openAllGates = false;
    this.result = '';
    this.gates = [];
    this.selectedGate = -1;
    this.invalidGateOpened = false;
    this.invalidOpenedGateNumber = -1;
    for (let i=0; i<3; i++) {
      let gate = new Gate();
        gate.close();
        gate.isSelected = false;
        gate.isWinning = i == this.prizedGate;
        gate.position = i;
        this.gates.push(gate);
    }
    this.state = 'initialized'
  }
  onGateSelection(event : {'door-position' : number}){
    if (!this.openAllGates) {
      console.log("user selected " + event['door-position'])
      this.gates.forEach ((gate) => {
        if (gate.position !== event['door-position']) {
          gate.isSelected = false;
        } else {
          gate.isSelected = true;
          this.selectedGate = event['door-position'];
        }
      });
      this.state = 'gate-selected';
      this.stateMessageMapping['gate-selected'].message = 'Great! You have chosen gate number <b>' + (this.selectedGate + 1)+ '</b>. Based on probability, the chances of the prize being behind this gate is 1/3, while the combined probability of the prize being behind the other two gates is 2/3. <br> Now, let\'s proceed to open a gate that does not have the prize.';
    }
    this.scrollToElement();
  }

  openInvalidGate = () =>  {
    console.log("opening an invalid gate")
    if (this.gates.filter(gate => gate.isSelected).length === 0) {
      console.log("Please select a gate before opening an invalid one!");
      return;
    }

    if (this.gates.filter(gate => gate.state == 'open').length > 0) {
      console.log("Unable to open more gates as per the rules configured!");
      return;
    }
    let gatesArray = this.gates
    .filter(item => !item.isWinning)
    .filter(item => !item.isSelected);
    const gateToBeOpened: Gate = gatesArray[Math.floor(Math.random() * gatesArray.length)];
    console.log ("open gate :" + gateToBeOpened.position);
    this.gates[gateToBeOpened.position].open();
    this.invalidGateOpened = true;
    this.invalidOpenedGateNumber = gateToBeOpened.position;
    this.state = 'invalid-gate-opened';
    this.scrollToElement();
  }
  switchSelectedGate = () => {

    let selectedgate = this.gates
    .filter(item => item.state !== 'open')
    .filter(item => !item.isSelected)[0];
    
    this.gates.forEach((gate) => gate.isSelected = false);
    selectedgate.isSelected = true;
    this.state = 'switched-selected-gates';
    this.scrollToElement();
  }
  seeResults = ()  => {
    this.openAllGates = true;
    let won = false;
    this.gates.forEach((gate) => {
      if (gate.isSelected && gate.isWinning) {
        console.log ("Congrats you won!")
        this.state = 'win'
        won = true;
      }
      gate.open();
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
        message:'Go ahead and select a gate by clicking on it',
        action: () => {},
        actionName: '',
        action2: () => {},
        action2Name: ''
      } ,
      'gate-selected' :
      { 
        message: '',
        action: this.openInvalidGate,
        actionName: 'Open an Invalid gate',
        action2: () => {},
        action2Name: ''
      },
      'invalid-gate-opened' :
      { 
        message: `<p>
        Here's the counter-intuitive aspect of the situation: On the screen, you see three gates.
       </p>
        <ol>
         <li>The gate you initially selected, which may or may not have the prize.</li>
         <li>The gate that has been opened, revealing that it doesn't have the prize.</li>
         <li>The remaining gate that you haven't selected, which may or may not have the prize.</li>
       </ol>
       <p>At this point, it may seem like the two closed gates have an equal probability of containing the prize, making it a 50% chance for each gate. However, it's important to note that the probability was determined when the prizes were placed behind the gates, and that hasn't changed. The additional information we now have is that the opened gate doesn't have the prize.</p>
       <p>This means that the gate you initially selected had a 1/3 chance of winning and a 2/3 chance of losing. In the scenarios where your chosen gate was losing, the other two gates were winning. But now, all of that probability has shifted to the one unopened gate. Therefore, from a probability standpoint, it is better to switch gates at this stage. </p>
       <p>Would you like to switch?</p>
     `,
        action: this.switchSelectedGate,
        actionName: 'Switch your selected gate',
        action2: this.seeResults,
        action2Name: 'Nah, I trust my intuitions'
      },
      'switched-selected-gates' : { 
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
    let totalGames = 1000;
    for (let i=0; i<totalGames; i++) {
      this.reset();
      let selectedGate = Math.floor(Math.random() * 3);
       this.onGateSelection({'door-position' : selectedGate});
       let won = this.selectedGate == this.prizedGate;
      let game:Row = new Row();
      game.initiallySelectedGate = selectedGate + 1;
      game.result = won? 'won' : 'lost';
      game.switched = false;
      game.winningGate = this.prizedGate + 1;
      this.rowData.push(game);
      if (won) {
        totalWins ++;
      }
      
    }
    this.isLoading = false;
    this.summary = "Without switching - you won " + totalWins + " games out of total "+totalGames+" games.";
    this.summary += "i.e. you won" + (totalWins*100/totalGames) + "% of times";
    
  }

  popupClosed(event : {}) {
    this.state= '';
  }

  scrollToElement() {
    this.messageContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
