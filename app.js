var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')
//const nocache = require('nocache');


// create express app
var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/dist/poseidon-ng/'));
//app.use(nocache());
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));




// listen for requests
app.listen(8080, function(){
    console.log("Server is listening on port 8080");
});
