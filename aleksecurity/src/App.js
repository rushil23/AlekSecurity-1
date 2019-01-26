import React, { Component } from "react";
import Webcam from "react-webcam";
import firebase from "firebase";

require("dotenv").config();

var config = {
  apiKey: process.env.API_KEY,
  authDomain: "aleksecurity.firebaseapp.com",
  databaseURL: "https://aleksecurity.firebaseio.com",
  projectId: "aleksecurity",
  storageBucket: "aleksecurity.appspot.com",
  messagingSenderId: "840580222472"
};

firebase.initializeApp(config);

var storageRef = firebase.storage().ref();

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
  };

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
      </div>
    );
  }
}

export default App;
