import React, { Component } from "react";
import Webcam from "react-webcam";
import firebase from "firebase";
import $ from "jquery";

const style = {
  "font-family": "Verdana",
  "text-align": "center"
};

var Blob = require("blob");
require("dotenv").config();

var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "aleksecurity.firebaseapp.com",
  databaseURL: "https://aleksecurity.firebaseio.com",
  projectId: "aleksecurity",
  storageBucket: "aleksecurity.appspot.com",
  messagingSenderId: "840580222472"
};

firebase.initializeApp(config);

var db = firebase.database();
var storage = firebase.storage();

var makeblob = dataURL => {
  console.log("Blob");

  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: "image/jpeg" });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: "image/jpeg" });
};

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageString = this.webcam.getScreenshot();

    console.log("Capture");
    return imageString;
  };

  setFalse = field => {
    db.ref(`${field}`).update({
      value: false
    });
  };

  setTrue = () => {
    db.ref("/takePic").set({
      value: true
    });
  };

  // Azure API call
  processing = (takePic, saveUser) => {
    var subscriptionKey = process.env.REACT_APP_AZURE_API_KEY;
    var uriBase =
      "https://canadacentral.api.cognitive.microsoft.com/face/v1.0/detect";
    var params = {
      returnFaceId: "true",
      returnFaceLandmarks: "false",
      returnFaceAttributes:
        "age,gender,headPose,smile,facialHair,glasses,emotion," +
        "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    $.ajax({
      url: uriBase + "?" + $.param(params),

      beforeSend: function(xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
      },

      type: "POST",
      processData: false,
      contentType: "application/octet-stream",

      // data:
      //   '{"url": ' +
      //   '"' +
      //   "https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg" +
      //   '"}'

      data: makeblob(this.capture())
    })
      .done(function(data) {
        // console.log(data[0].faceId); //[0].faceId);
        console.log("step 1");

        if (takePic) {
          db.ref("/current").set({
            currentUserAtDoor: data[0].faceId
          });
        }

        if (saveUser) {
          let name;
          let faceId;

          db.ref("/saveUser").update({
            newFaceId: data[0].faceId
          });

          db.ref("/saveUser").once("value", snapshot => {
            console.log("bless");
            name = snapshot.val().name;
            faceId = snapshot.val().newFaceId;

            console.log("FaceID " + faceId);
            var temp = {};
            temp[name] = faceId;
            db.ref("/users").update(temp);
          });
        }

        // this.uploadId(data[0].faceId);
      })
      .fail(function(data) {
        console.log("wtf");
      });
  };

  componentWillMount() {
    // If user asks Alexa who is at the door, this boolean value will change and will trigger an image to be taken and sent to firebase
    db.ref("/takePic/value").on("value", snapshot => {
      if (snapshot.val() == true) {
        console.log("Take Pic: " + snapshot.val());
        this.processing(true, false);
        this.setFalse("/takePic");
      }
    });

    // If user asks Alexa to save a user
    db.ref("/saveUser/value").on("value", snapshot => {
      if (snapshot.val() == true) {
        console.log("Save User: " + snapshot.val());
        this.processing(false, true);
        this.setFalse("/saveUser");
      }
    });
  }

  componentWillUnmount() {
    this.db.ref("/takePic").off();
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div style={style}>
        AlekSecurity
        <Webcam
          audio={false}
          // width={`90%`}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={`100%`}
          videoConstraints={videoConstraints}
        />
        {/* <div>
          <button onClick={this.capture}>Capture photo</button>
        </div>
        <div>
          <button onClick={this.setFalse}>Set false</button>
        </div>
        <div>
          <button onClick={this.setTrue}>Set true</button>
        </div>
        <div>
          <button onClick={this.processing}>Processing</button>
        </div> */}
      </div>
    );
  }
}

export default App;
