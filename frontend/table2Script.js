const table = document.getElementById("tableBody");

const params = new URLSearchParams(window.location.search);
const comp = params.get("comp");

fetch("/search-submit?comp=" + encodeURIComponent(comp))
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(row => {
            table.innerHTML += `
                <tr>
                    <td>${row.team}</td>
                    <td>${codeToEnglishTable(row.autoLocation.replaceAll(',', ' '))}</td>
                    <td>${codeToEnglishTable(row.autoDo.replaceAll(',', ' '))}</td>
                    <td>${codeToEnglishTable(row.role.replaceAll(',', ' '))}</td>
                    <td>${row.roleRating + "/5"}</td>   
                    <td>${row.aimRating + "/5"}</td>
                    <td>${row.hopperRating + "/5"}</td>    
                    <td>${row.shootRating + "/5"}</td>  
                    <td>${codeToEnglishTable(row.carry.replaceAll(',', ' '))}</td> 
                    <td>${codeToEnglishTable(row.travel.replaceAll(',', ' '))}</td>
                    <td>${codeToEnglishTable(row.robot_climb.replaceAll(',', ' '))}</td>     
                </tr>
            `;
        });

    });
        /*  
           
            
            <td>${row.climbLocation}</td>
            <td>${row.disabled}</td>
            <td>${row.dq}</td>
            <td>${row.notes}</td> 
        
*/
/*The sequal uses an advanced dictionary system to replace values
because it has been many months since I coded the first one.
*/
function codeToEnglishTable(text) { 
    const translations = {
        NeutralZone: "Neutral Zone",
        humanPlayerStation: "Human Player Station",
        shoot: "Shoot",
        defense: "Defense",
        climb: "Climb",
        none: "Nothing",
        scoring: "Scoring",
        defense: "Defense",
        support: "Support",
        bump: "Bump",
        trench: "Trench",
        scoredNoClimb: "Scoring(No attempt)",
        lvl1: "Climbed lvl 1",
        lvl2: "Climbed lvl 2",
        lvl3: "Climbed lvl 3",
        betweenPoles: "Between Poles",
        onSides: "On Sides",
        noClimb: "Failed Climb",
        yes: "Yes",
        no: "No"
    };

    for (const [code, english] of Object.entries(translations)) {
        text = text.replaceAll(code, english);
    }

    return text;
}