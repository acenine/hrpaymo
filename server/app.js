const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sampledata = require('../sampledata.js');
const signupdb = require('../database/signup.js');
const db = require('../database/index.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/../client/dist'));


app.post('/login', (req, res) => {
  console.log('login body', req.body);
  res.sendStatus(200);
});

app.post('/signup', (req, res) => {
  // console.log('signup post with data:', req.body);
  db.newUserSignup(req.body, 100)
    .then(userId => {
      console.log('successful signup with userId:', userId);
      res.status(201).json({ userid: userId });
    })
    .catch(err => {
      console.error('error on user signup:', err);
      // TODO: send responses depending on what type of error is thrown
      if(err.constraint.includes('users_user')) {
        res.status(422).json({ error : "Username must be unique." });
      } else if(err.constraint.includes('users_email')) {
        res.status(422).json({ error: "Email must be unique." });
      } else if(err.constraint.includes('users_phone')) {
        res.status(422).json({ error: "Phone number must be unique." });
      } else {
        res.status(400).json({ error: "Improper format." });
      }
    })
})

app.get('/feed/global', (req, res) => {

  // DB query should replace default promise
  Promise.resolve(sampledata.sampleFeed)
    .then((results) => {
      res.status(200).json({items: results});
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })

});

app.get('/feed/user/:userId', (req, res) => {
  
  // DB query should replace default promise
  let userId = req.params && req.params.userId;

  Promise.resolve(sampledata.sampleFeed)
    .then((results) => {
      res.status(200).json({items: results});
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
});


module.exports = app;

