const express = require("express");
var firebase = require("firebase");
// var storage = require("firebase/storage");
// import firebase from "firebase";

/*


* - To Do: 

1. Get face ID from Firebase Database
2. Send each face ID

*/
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

function verifyTwoIds(id1,id2){
  console.log("Comparing "+id1+" and "+id2);
}


firebase.initializeApp(config);

var db = firebase.database();
//console.log(db);

var dbRefUsers = db.ref("/users");//.child("users"); // Reference to current users list

db.ref("/current").on("value", snapshot => {
  if (snapshot.val()) {
    console.log("\n\nThere is a new user at door! " + snapshot.val()["currentUserAtDoor"]);
    var currentUser = snapshot.val()["currentUserAtDoor"];
    return dbRefUsers.once('value').then(function(userSnapshot) {
      var userData = userSnapshot.val();

      console.log("The user data is : ");
      console.log(userData);
    
      for(var key in userData){

        console.log("The key is: "+key+" and the value is: "+userData[key]);
        verifyTwoIds(currentUser,userData[key]);



      }



      
    
    
    
    })

  }
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
