var prizedDoor = Math.floor((Math.random() * 3) + 1);
$(".door").click(function() {
var door=$(this);
if(!door.hasClass("disabled")){
        toggleSelectDoor(door);
        $("#next").removeClass("hidden");
}

});
function checkResults(){
if(prizedDoor==getSelectedDoorNumber()){
               $("#msgBox").text("Congrats! You won");
               
        }
        else{
                $("#msgBox").text("Better luck next time!");
        }
        openAllDoors();
        
}
function openAllDoors(){
       var doorToBeOpened;
        for (var i=1;i<=3;i++){
                if(i==prizedDoor){
                       var doorClass= getDoorClassFromNumber(i);
                         $("."+doorClass).addClass("prize");
                }
                else{
                var doorClass= getDoorClassFromNumber(i);
                         $("."+doorClass).addClass("opened");
                         $("."+doorClass).removeClass("selected");
                }
        }
 
}
function spoiler(){
$("#spoiler").html( prizedDoor);
}
function reduceChoice(){
$("#description").append("Remember, the probability doesn't change on doors being opened."
 +"It was decided when doors were originally closed. The door you chose had probability of 1/3."
 +" The other doors combined having prize had a probability of 2/3"
 +"Now, that one of the incorrect door is opened, that 2/3 probability now belongs to only door that you have not chosen"
 +" Hence, Switching the doors will give you additional advantage (according to probability theory"
 +"Remember, higher the probability, higher your chances of winning."
 
 );
        if(prizedDoor==getSelectedDoorNumber()){
                openRandomUnselectedDoor();
        }
        else{
                openUnselectedGoatDoor();
        }
$("#next").addClass("hidden");
$("#checkResults").removeClass("hidden");
$("#msgBox").html("Would you like to switch?<button onclick=\"switchDoor()\">switch</button>");
}

function switchDoor(){
        for (var i=1;i<=3;i++){
                var doorClass= getDoorClassFromNumber(i);
              var door= $("."+doorClass);
                if(!(isOpen(door)||isSelected(door))){
                       
                                selectDoor(door);
                         
                         
                }
        }
}
function openRandomUnselectedDoor(){
/*False opens first one*/
openUnselectedGoatDoor();
}
function openUnselectedGoatDoor(){
       var doorToBeOpened;
        for (var i=1;i<=3;i++){
                if(!((i==prizedDoor)||i==getSelectedDoorNumber())){
                        doorToBeOpened=i;
                }
        }
 openDoor(doorToBeOpened);
}
function openDoor(doorNumber){
        var doorClass= getDoorClassFromNumber(doorNumber);
        $("."+doorClass).addClass("opened");
        $("."+doorClass).addClass("disabled");
}
function getDoorClassFromNumber(doorNumber){
        if( doorNumber==1){
           return "first";
       }
       if( doorNumber==2){
           return "second";
       }
       if( doorNumber==3){
           return "third";
       }
}
function toggleSelectDoor(door){
        if(isSelected(door)){
                unselectDoor(door);
        }
        else{
                selectDoor(door);
        }
}

function selectDoor(door){
        
        $(".door").removeClass("selected");
        
        if(door.hasClass("closed")){
            door.addClass("selected");
            
            door.removeClass("opened");
         }
         $("#msgBox").text("The probability of prize being behind selected door is 1/3, and it being behind other doors combined is 2/3");
}

function unselectDoor(door){
       door.addClass("closed");   
       door.removeClass("opened");    
       door.removeClass("selected");   
}

function isSelected(door){
        return door.hasClass("selected");
}
function isOpen(door){
        return door.hasClass("opened");
}
function getSelectedDoorNumber(){

       if( $(".selected").hasClass("first")){
           return 1;
       }
        if( $(".selected").hasClass("second")){
           return 2;
       }
       if( $(".selected").hasClass("third")){
           return 3;
       }
}

/**
*   below is the automation part
**/
var selectedDoorNumberForAutomation;
var switchforautomation=false;
function automate(){
var totalwins=0;
        for (var i=1;i<=1000;i++){
        setup();
        switchrandomly();
        checkResults();
        var won=($("#msgBox").text()=="Congrats! You won");
        if(won){
        totalwins++;
        }
        $("#resulttable").append("<tr><td>"+i+"</td><td>"+selectedDoorNumberForAutomation+"</td><td>"+switchforautomation+"</td><td>"+prizedDoor+"</td><td>"+won+"</td></tr>");
        }
        $("#msgBox").text("you won "+totalwins+" times out of 1000");
}
function switchrandomly(){
//don't switch
}
function setup(){
$(".door").removeClass("opened");
$(".door").removeClass("selected");
$(".door").removeClass("prize");
$(".door").addClass("closed"); 
prizedDoor = Math.floor((Math.random() * 3) + 1);
selectedDoorNumberForAutomation=Math.floor((Math.random() * 3) + 1);
  var doorClass= getDoorClassFromNumber(selectedDoorNumberForAutomation);
      var selecteddoor=  $("."+doorClass);
        selectDoor(selecteddoor);
}



