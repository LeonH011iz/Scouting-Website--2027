const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const path = require('path');

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/HomePage.html'));
});


app.use(express.static(path.join('..','frontend'))); //applys the css and javascript to the html

app.get('/form', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'frontend/RoboticsScoutingForm.html')); //opens the html at /fr
});
 
// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});