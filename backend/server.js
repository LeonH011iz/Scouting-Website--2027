const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('scouting.db');
//const FILE_PATH = path.join(__dirname, 'scoutingData.json');


// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/HomePage.html'));
});

app.use(express.static(path.join('..','frontend'))); //applys the css and javascriptno to the html

app.get('/form', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'frontend/RoboticsScoutingForm.html')); //opens the html at /fr
});

app.use(express.urlencoded({ extended: true }));

app.get('/data', (req, res) =>  {
        const data = db.prepare(`SELECT * FROM scoutingData`).all(); 
        console.table(data);
        res.json(data); 
});

app.post('/submit-form', (req, res) => {
    let email = req.body.email; //gets all of the values and converts 
    let comp = req.body.comp; //arrays to strings and filters blank values when neccesary
    let teamColor = req.body.teamColor;
    let team = Number(req.body.team);
    let autoLocation = req.body.autoLocation.filter(item => item !== "");
    autoLocation = JSON.stringify(autoLocation);
    let autoDo = req.body.autoDo
    if (!Array.isArray(autoDo)) { //this turns non arrays to arrays 
        autoDo = [autoDo]; //we do this because having all arrays of varying lengths including lengths of 1
    }//is better than haing some arrays of varying lengths and some non arrays 
    autoDo.filter(item => item !== ""); //I only have to do this for checkboxes without an "other" option 
    autoDo = JSON.stringify(autoDo);
    let role = req.body.role.filter(item => item !== "");
    role = JSON.stringify(role);
    let roleRating = Number(req.body.roleRating);
    let aimRating = Number(req.body.aimRating);
    let hopperRating = Number(req.body.hopperRating);
    let shootRating = Number(req.body.shootRating);
    let carry = req.body.carry;
    let travel = req.body.travel
    if(!Array.isArray(travel)){
        travel = [travel];
    }
    travel.filter(item => item !== "");
    travel = JSON.stringify(travel);
    let climb = req.body.climb.filter(item => item !== "");
    climb = JSON.stringify(climb);
    let climbLocation = req.body.climbLocation.filter(item => item !== "");
    climbLocation = JSON.stringify(climbLocation);
    let disabled = req.body.disabled.filter(item => item !== "");
    disabled = JSON.stringify(disabled);
    let dq = req.body.dq.filter(item => item !== "");
    dq = JSON.stringify(dq);
    let notes = req.body.notes.trim();
    if(notes === ""){
        notes = null; //replaces whitespace with nothing
    }

const stmt = db.prepare(`
INSERT INTO scoutingData (
    email,
    comp,
    teamColor,
    team,
    autoLocation,
    autoDo,
    role,
    roleRating,
    aimRating,
    hopperRating,
    shootRating,
    carry,
    travel,
    climb,
    climbLocation,
    disabled,
    dq,
    notes
)
VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
`);
    
stmt.run(
    email,
    comp,
    teamColor,
    team,
    autoLocation,
    autoDo,
    role,
    roleRating,
    aimRating,
    hopperRating,
    shootRating,
    carry,
    travel,
    climb,
    climbLocation,
    disabled,
    dq,
    notes
);
    
    res.redirect('/');
});

 
// Start the server
app.listen(port, () => {
  console.log(`Scouting Website listening at http://localhost:${port}`);
});




db.prepare(`
CREATE TABLE IF NOT EXISTS scoutingData (
    id INTEGER PRIMARY KEY,
    email TEXT,
    comp TEXT,
    teamColor TEXT,
    team INTEGER,
    autoLocation TEXT, 
    autoDo TEXT,
    role TEXT,
    roleRating INTEGER,
    aimRating INTEGER,
    hopperRating INTEGER,
    shootRating INTEGER,
    carry TEXT,
    travel TEXT,
    climb TEXT,
    climbLocation TEXT,
    disabled TEXT,
    dq TEXT,
    notes TEXT
)
`).run();

