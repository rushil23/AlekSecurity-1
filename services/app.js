const express = require("express");
var firebase = require("firebase");

require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  apiKey: process.env.API_KEY,
  authDomain: "aleksecurity.firebaseapp.com",
  databaseURL: "https://aleksecurity.firebaseio.com",
  projectId: "aleksecurity",
  storageBucket: "aleksecurity.appspot.com",
  messagingSenderId: "840580222472"
};
firebase.initializeApp(config);

var db = firebase.database();

app.get("/", (req, res) => {
  db.ref("/Matt")
    .once("value")
    .then(snapshot => {
      res.send(snapshot.val());
    });
});

app.listen(port, () => {
  console.log("Server is running. Port: ", port);
});
