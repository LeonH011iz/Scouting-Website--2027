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

app.get('/table', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'frontend/table.html')); 
});

app.get('/organized-Table-Test', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'frontend/search.html')); 
});

app.use(express.urlencoded({ extended: true }));

app.post('/search-submit', (req, res) => {
    const comp = req.body.comp;

    res.redirect('/table2?comp=' + encodeURIComponent(comp));
});

app.get('/search-submit', (req, res) => {
    const comp = req.query.comp;

    const data2 = getSearchData(comp);

    res.json(data2);
});

function getSearchData(comp){
    //That is a testing value comp
    const data2 = db.prepare(`
        WITH auto_location AS (
            SELECT 
            a.teamNumber,
            a.teamNumber || ' - ' || a.teamName AS team,
            al.value AS autoLocation,
            count(*) as autoLoc_count
         From scoutingData a,
            json_each(a.autoLocation) al
         WHERE a.comp = ? 
         GROUP BY a.teamNumber, a.teamName, al.value
        ),

       auto_location_totals AS (
            SELECT
                team,
                SUM(autoLoc_count) AS total
            FROM auto_location
            GROUP BY team
        ),

        auto_do AS (
            SELECT
            aa.teamNumber,
            aa.teamNumber || ' - ' || aa.teamName AS team,
            ad.value AS autoDo,
            count(*) as autoDo_count
            From scoutingData aa,
                json_each(aa.autoDo) ad
            WHERE aa.comp = ?
           GROUP BY aa.teamNumber, aa.teamName, ad.value
        ),

        auto_do_totals AS (
            SELECT 
                team, 
                SUM(autoDo_count) AS total
            FROM auto_do
            GROUP BY team
        ),

        robot_role AS (
            SELECT
            r.teamNumber,
            r.teamNumber || ' - ' || r.teamName AS team,
            rp.value AS role,
            count(*) as role_count
            From scoutingData r,
                json_each(r.role) rp
            WHERE r.comp = ?
            GROUP BY r.teamNumber, r.teamName, rp.value
        ),

        robot_role_totals AS (
            SELECT
                team,
                SUM(role_count) AS total
            FROM robot_role
            GROUP BY team
        ),

        role_rating AS (
            SELECT
                rr.teamNumber,
                rr.teamNumber || ' - ' || rr.teamName AS team,
                ROUND(AVG(rr.roleRating), 2) AS roleRating
            FROM scoutingData rr
            WHERE rr.comp = ?
            GROUP BY rr.teamNumber, rr.teamName
        ),

        aim_rating AS (
            SELECT
                ar.teamNumber,
                ar.teamNumber || ' - ' || ar.teamName AS team,
                ROUND(AVG(ar.aimRating), 2) AS aimRating
            FROM scoutingData ar
            WHERE ar.comp = ?
            GROUP BY ar.teamNumber, ar.teamName
        ),

        hopper_rating AS (
            SELECT
                hr.teamNumber,
                hr.teamNumber || ' - ' || hr.teamName AS team,
                ROUND(AVG(hr.hopperRating), 2) AS hopperRating
            FROM scoutingData hr
            WHERE hr.comp = ?
            GROUP BY hr.teamNumber, hr.teamName
        ),

        shoot_rating AS (
            SELECT
                sr.teamNumber,
                sr.teamNumber || ' - ' || sr.teamName AS team,
                ROUND(AVG(sr.shootRating), 2) AS shootRating
            FROM scoutingData sr
            WHERE sr.comp = ?
            GROUP BY sr.teamNumber, sr.teamName
        ),

        carried_question AS (
            SELECT
            c.teamNumber,
            c.teamNumber || ' - ' || c.teamName AS team,
            c.carry AS carry,
            count(*) as carry_count
            FROM scoutingData c
            WHERE c.comp = ?
           GROUP BY c.teamNumber, c.teamName, c.carry
        ),

        carried_question_totals AS (
            SELECT
                team,
                SUM(carry_count) AS total
            FROM carried_question
            GROUP BY team
        ),

        travel_pref AS (
            SELECT
            t.teamNumber,
            t.teamNumber || ' - ' || t.teamName AS team,
            tp.value AS travel,
            count(*) as travel_count
        From scoutingData t,
            json_each(t.travel) tp
            WHERE t.comp = ?
           GROUP BY t.teamNumber, t.teamName, tp.value
        ),

        travel_pref_totals AS (
            SELECT
                team,
                SUM(travel_count) AS total
            FROM travel_pref
            GROUP BY team
        ),

        robot_climb AS (
            SELECT
            rc.teamNumber,
            rc.teamNumber || ' - ' || rc.teamName AS team,
            cc.value AS climb,
            count(*) as climb_count
            From scoutingData rc,
                json_each(rc.climb) cc
            WHERE rc.comp = ?
           GROUP BY rc.teamNumber, rc.teamName, cc.value
        ),

        robot_climb_totals AS (
            SELECT 
                team, 
                SUM(climb_count) AS total
            FROM robot_climb
            GROUP BY team
        ),

        auto_location_combined AS (
        SELECT
            auto_location.teamNumber,
            auto_location.team,
            GROUP_CONCAT(
                auto_location.autoLocation || ': ' ||
                ROUND(
                    auto_location.autoLoc_count * 100.0
                    / auto_location_totals.total,
                    2
                ) || '%'
            ) AS autoLocation
        FROM auto_location
        JOIN auto_location_totals
            ON auto_location.team = auto_location_totals.team
        GROUP BY auto_location.teamNumber, auto_location.team
      ),
        
        auto_do_combined AS (
        SELECT
            auto_do.teamNumber,
            auto_do.team,
            GROUP_CONCAT(
                auto_do.autoDo || ': ' ||
                ROUND(
                    auto_do.autoDo_count * 100.0
                    / auto_do_totals.total,
                    2
                ) || '%'
            ) AS autoDo
        FROM auto_do
        JOIN auto_do_totals
            ON auto_do.team = auto_do_totals.team
        GROUP BY auto_do.teamNumber, auto_do.team
        ),

        robot_role_combined AS (
            SELECT
                robot_role.teamNumber,
                robot_role.team,
                GROUP_CONCAT(
                    robot_role.role || ': ' ||
                    ROUND(
                        robot_role.role_count * 100.0
                        / robot_role_totals.total,
                        2
                    ) || '%'
                ) AS role
            FROM robot_role
            JOIN robot_role_totals
                ON robot_role.team = robot_role_totals.team
            GROUP BY robot_role.teamNumber, robot_role.team
        ),

        carried_question_combined AS (
        SELECT
            carried_question.teamNumber,
            carried_question.team,
            GROUP_CONCAT(
                carried_question.carry || ': ' ||
                ROUND(
                    carried_question.carry_count * 100.0
                    / carried_question_totals.total,
                    2
                ) || '%'
            ) AS carry
        FROM carried_question
        JOIN carried_question_totals
            ON carried_question.team = carried_question_totals.team
        GROUP BY carried_question.teamNumber, carried_question.team
        ),

        travel_pref_combined AS (
        SELECT
            travel_pref.teamNumber,
            travel_pref.team,
            GROUP_CONCAT(
                travel_pref.travel || ': ' ||
                ROUND(
                    travel_pref.travel_count * 100.0
                    /travel_pref_totals.total,
                    2
                ) || '%'
            ) AS travel
        FROM travel_pref
        JOIN travel_pref_totals
            ON travel_pref.team = travel_pref_totals.team
        GROUP BY travel_pref.teamNumber, travel_pref.team
        ),

        robot_climb_combined AS (
        SELECT
            robot_climb.teamNumber,
            robot_climb.team,
            GROUP_CONCAT(
                robot_climb.climb || ': ' ||
                ROUND(
                    robot_climb.climb_count * 100.0
                    / robot_climb_totals.total,
                    2
                ) || '%'
            ) AS robot_climb
        FROM robot_climb
        JOIN robot_climb_totals
            ON robot_climb.team = robot_climb_totals.team
        GROUP BY robot_climb.teamNumber, robot_climb.team
      )

        SELECT
        auto_location_combined.teamNumber,
        auto_location_combined.team AS team,
        auto_location_combined.autoLocation,
        auto_do_combined.autoDo,
        robot_role_combined.role,
        role_rating.roleRating,
        aim_rating.aimRating,
        hopper_rating.hopperRating,
        shoot_rating.shootRating,
        carried_question_combined.carry,
        travel_pref_combined.travel,
        robot_climb_combined.robot_climb

        FROM auto_location_combined

        LEFT JOIN auto_do_combined
            ON auto_location_combined.team = auto_do_combined.team

        LEFT JOIN robot_role_combined
            ON auto_location_combined.team = robot_role_combined.team

         LEFT JOIN role_rating
            ON auto_location_combined.team = role_rating.team

        LEFT JOIN aim_rating
            ON auto_location_combined.team = aim_rating.team

        LEFT JOIN hopper_rating
            ON auto_location_combined.team = hopper_rating.team
        
        LEFT JOIN shoot_rating
            ON auto_location_combined.team = shoot_rating.team

        LEFT JOIN carried_question_combined
            ON auto_location_combined.team = carried_question_combined.team
        
        LEFT JOIN travel_pref_combined
            ON auto_location_combined.team = travel_pref_combined.team
        
        LEFT JOIN robot_climb_combined
            ON auto_location_combined.team = robot_climb_combined.team
        
            

        ORDER BY auto_location_combined.teamNumber
        `).all(comp, comp, comp, comp, comp, comp, comp, comp, comp, comp)

        return(data2);
    }

app.get('/table2', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'frontend/table2.html')); 
});
app.get('/data', (req, res) =>  {
        //db.prepare(`DELETE FROM scoutingData`).all();
        const data = db.prepare(`SELECT * FROM scoutingData`).all(); 
        console.table(data);
        res.json(data); 
});

app.post('/submit-form', (req, res) => {
    let email = req.body.email; //gets all of the values and converts 
    let comp = req.body.comp; //arrays to strings and filters blank values when neccesary
    let teamColor = req.body.teamColor;
    let teamCall = req.body.team.split(" - ");
    let teamNumber = Number(teamCall[0]);
    let teamName = teamCall[1];
    let autoLocation = req.body.autoLocation.filter(item => item !== "");
    autoLocation = JSON.stringify(autoLocation);
    let autoDo = req.body.autoDo
    if (!Array.isArray(autoDo)) { //this turns non arrays to arrays 
        autoDo = [autoDo]; //we do this because having all arrays of varying lengths including lengths of 1
    }//is better than haing some arrays of varying lengths and some non arrays 
    autoDo = autoDo.filter(item => item !== ""); //I only have to do this for checkboxes without an "other" option 
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
    travel = travel.filter(item => item !== "");
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
    teamNumber,
    teamName,
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
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
`);
    
stmt.run(
    email,
    comp,
    teamColor,
    teamNumber,
    teamName,
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

 





db.prepare(`
CREATE TABLE IF NOT EXISTS scoutingData (
    id INTEGER PRIMARY KEY,
    email TEXT,
    comp TEXT,
    teamColor TEXT,
    teamNumber INTEGER,
    teamName TEXT,
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

// Start the server
app.listen(port, () => {
  console.log(`Scouting Website listening at http://localhost:${port}`);
});