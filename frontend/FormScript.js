//How to use first in terminal
//Assuming the file is downloaded and on your desktop
//This is more as a reminder for me to remember how to open this
//It will probobly be different for you
//$ cd ~/Desktop/robotics-scouting-form/backend
//$ node server.js
//Then go to http://localhost:8080
//Then click on the html file!
//testing
const teamList = "2026casgv_team_list.csv";

fetch(teamList) //Gathers the teamList from the csv file and puts it into the slecet drop down question because I am not manually doing that for every single comp
	.then(response => response.text())
	.then(data => {
		const lines = data.split('\n');
    		const select = document.getElementById("team");

	for(let i = 1; i < lines.length; i++){
        const values = lines[i].split(',');
        const teamNumber = values[0] + " - " + values[1];

        if(teamNumber){
            const option = document.createElement("option");
            option.value = teamNumber;
            option.textContent = teamNumber;
            select.appendChild(option);

        }
    }
});

function setupOther(buttonID, textboxID){ //This sets up other boxs allowing people to write an awnser in if they select the other checkbox

    const button = document.getElementById(buttonID);
    const textbox = document.getElementById(textboxID);

    if(button.type == "checkbox"){
        button.addEventListener("change", function(){

            textbox.hidden = !button.checked;
            textbox.required = button.checked;
            textbox.value = "";

        });
    }
    if(button.type == "radio"){
        const radios = document.querySelectorAll(`input[type="radio"][name=${button.name}]`);
        for(let i = 0; i < radios.length; i++){
            radios[i].addEventListener("change", function(){
                textbox.hidden = !button.checked;
                textbox.required = button.checked;
                textbox.value = "";
            });
        }
    }
}

setupOther("otherAutoLoc", "otherAutoTextLoc"); //this actually sets up the other
setupOther("otherRole", "otherTextRole"); 
setupOther("otherClimb", "otherTextClimb");
setupOther("otherClimbLoc", "otherTextClimbLoc");
setupOther("disabledYes", "disabledText");
setupOther("dqYes", "dqText");


const form = document.getElementById("scoutingForm");
const checkboxList = ["autoLocation", "autoDo", "role", "travel", "climbLocation"]; //This is a list of checkbox questions

form.addEventListener("submit", function(event){ //this makes the checkbox listed "required" in a sense by not letting you submit and telling you what you missed
    let missedList = [];
    for(let i = 0; i < checkboxList.length; i++){
            const boxes = document.querySelectorAll(`input[type="checkbox"][name=${checkboxList[i]}]`);
                let selected = false;
                for(let j = 0; j < boxes.length; j++){
                    if(boxes[j].checked){
                        selected = true;
                        break;
                    }
                }
                if(!selected){
                    missedList.push(checkboxList[i]);
                }
    }
    if(missedList.length != 0){ //tells you which checkboxes you missed
        let word = "You need to awnser: " + codeToEnglish(missedList[0]);
        for(let i = 1; i < missedList.length; i++){
            word += ", " + codeToEnglish(missedList[i]);
        }
        event.preventDefault();
        alert(word);
    }
});

const translate = ["\"Where did they go in auto?\"", "\"If they had an Auto did they?\"", "\"What was there role?\"","\"Travel Preference\"", "\"Where did they climb?\""];
//an inegenous function that translates code to english by matching two different arrays, without the use of a file of dictonary as those are unnessary on such small of a scale
function codeToEnglish(word){
    for(let i = 0; i < checkboxList.length; i++){
        if(word == checkboxList[i]){
            return translate[i];
        }
    }
    return "<YouShouldn'tSeeThis>";
}
