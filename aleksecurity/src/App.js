import React, { Component } from "react";
import Webcam from "react-webcam";
import firebase from "firebase";
import $ from "jquery";

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

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageString = this.webcam.getScreenshot();
    const image = imageString.replace("data:image/jpeg;base64,", "");

    const uploadTask = storage
      .ref("requests/personAtDoor")
      .putString(image, "base64");

    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("requests")
          .child("personAtDoor")
          .getDownloadURL()
          .then(url => {
            console.log(url);
          });
      }
    );
  };

  setFalse = () => {
    db.ref("/pic").set({
      take: false
    });
  };

  setTrue = () => {
    db.ref("/pic").set({
      take: true
    });
  };

  // Testing Azure face api call
  processing = () => {
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
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
      },

      type: "POST",

      data:
        '{"url": ' +
        '"' +
        "https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg" +
        '"}'
    })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(data) {
        console.log("wtf");
      });
  };

  componentWillMount() {
    db.ref("/pic/take").on("value", snapshot => {
      if (snapshot.val() == true) {
        console.log("Current value: " + snapshot.val());
        this.capture();
        this.setFalse();
      }
    });
  }

  componentWillUnmount() {
    this.db.ref("/pic/take").off();
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          //   height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          //   width={350}
          videoConstraints={videoConstraints}
        />
        <div>
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
        </div>
      </div>
    );
  }
}

export default App;
