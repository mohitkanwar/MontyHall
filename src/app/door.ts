export class Door {
   
   
    state :string = 'closed';
    isWinning = false;
    position: number = 0;
    image: string = '';
    isSelected = false;

    open() {
        this.state = 'open';
        
        this.image = this.isWinning ? 
                        'assets/images/open-win.png'
                        : 'assets/images/open-lose.png';
    }

    close() {
        this.state = 'close';
        this.image='../assets/images/closed.png';
    }
}