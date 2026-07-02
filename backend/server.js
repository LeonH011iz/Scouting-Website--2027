const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


const path = require('path');
app.use(express.static(path.join('..','frontend'))); //applys the css and javascript to the html

app.get('/form', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'frontend/RoboticsScoutingForm.html')); //opens the html at /form
});
 
// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});