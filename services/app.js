// ---- SETUP ----

const express = require("express");
var firebase = require("firebase");
const request = require('request');

var matchFound = false;
var threshold = 0.6;
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "aleksecurity.firebaseapp.com",
  databaseURL: "https://aleksecurity.firebaseio.com",
  projectId: "aleksecurity",
  storageBucket: "aleksecurity.appspot.com",
  messagingSenderId: "840580222472"
};

// ------- MAIN CODE ---------

firebase.initializeApp(config);

var db = firebase.database();
//console.log(db);

var dbRefUsers = db.ref("/users");//.child("users"); // Reference to current users list




function verifyTwoIds(id2,id1,name){


  console.log("Comparing "+id1+" WITH ---> "+id2);
  // Replace <Subscription Key> with your valid subscription key.
  const subscriptionKey = process.env.AZURE_API_KEY;

  // You must use the same location in your REST call as you used to get your
  // subscription keys. For example, if you got your subscription keys from
  // westus, replace "westcentralus" in the URL below with "westus".
  const uriBase = 'https://canadacentral.api.cognitive.microsoft.com/face/v1.0/verify';

  const options = {
      uri: uriBase,
      body: '{"faceId1": ' + '"' + id1 + '","faceId2": '+ '"'+id2+'"'+'}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

    var resp = JSON.parse(body);

    if ("error" in resp){
      console.log("--------- ERROR -----------");
      var errorResp = resp["error"];
      console.log("ERROR MESSAGE: "+errorResp["message"]);
    }
    else{
      var isIdentical = resp["isIdentical"];
      var confidence = resp["confidence"];

      isIdentical = confidence>threshold;
      console.log("\nSuccess! : "+String(confidence)+" ---- "+String(isIdentical));
      if (isIdentical){
        console.log("ITS A MATCH ----- "+name);
        db.ref("/isMatch").set({
          name:name,
          value: true
        });

      }
      else {
        console.log("Did not match with "+name);
        db.ref("/isMatch").update({
          value: false
        });
      }
      console.log("Is identical ? "+String(isIdentical));
      console.log("Confidence amount: "+String(confidence));
      matchFound = isIdentical;
      return isIdentical;
    }
  });
}

db.ref("/authenticate").on("value", snapshot =>{
  
  var authenticate = snapshot.val()["value"];
  var name = snapshot.val()["name"];

  if (authenticate){
    console.log("Authentication request received from Alexa FOR NAME = "+name);

    var faceId = "initial";

    db.ref("/current").once('value').then(function(currentSnapshot) {
      faceId = currentSnapshot.val()["currentUserAtDoor"];
      console.log("Face ID for "+name+" is : "+faceId);
      var dict = {};
      dict[name] = faceId;

      db.ref("/users").update(dict);

      db.ref("/authenticate").update({
        value:false
      });
    });  
  }

});


db.ref("/current").on("value", snapshot => {
  console.log("\n\nThere is a new user at door! " + snapshot.val()["currentUserAtDoor"]);
  var currentUser = snapshot.val()["currentUserAtDoor"];
  return dbRefUsers.once('value').then(function(userSnapshot) {
    var userData = userSnapshot.val();

    console.log("The user data is : ");
    console.log(userData);
  
    for(var key in userData){
      console.log("The key is: "+key+" and the value is: "+userData[key]);
      var isMatch = verifyTwoIds(currentUser,userData[key],key);
      if(isMatch){
        console.log("Match found! This guy is "+key);
        console.log("BREAKING! ")
        break;
      }
    } 
  
  })

});


return 





// var storage = firebase.storage();

app.listen(port, () => {
  console.log("Server is running. Port: ", port);
});

// app.get('/upload_image', (req, res, next) => {
//   console.log({ files: req.files });
// })

// storage.ref("existing").child("personAtDoor").getDownloadURL().then(url => {
//   console.log(url);
// })
