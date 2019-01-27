import $ from "jquery";

require("dotenv").config();

const processing = () => {
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

  console.log("Hello");
};

export default processing;
