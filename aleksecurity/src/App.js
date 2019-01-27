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

var storage = firebase.storage();

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageString = this.webcam.getScreenshot();
    console.log(imageString);

    const image = imageString.replace("data:image/jpeg;base64,", "");
    console.log(image);

    // const uploadTask = storage.ref(`current/testImage`).put(imageSrc);

    const uploadTask = storage
      .ref("existing/testImage")
      .putString(image, "base64");

    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("existing")
          .child("testImage")
          .getDownloadURL()
          .then(url => {
            console.log(url);
          });
      }
    );
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
