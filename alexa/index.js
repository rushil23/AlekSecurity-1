/* eslint-disable  func-names */
/* eslint-disable  no-console */

// const firebase = require('firebase');
const SKILL_NAME = 'Door Query';
const RECOGNIZED_FACE = 'The person at the door is: ';
const DOES_NOT_RECOGNIZE = 'I don\'t recognize this person';
const ASK_OPEN = 'Should I open the door?';
const ASK_TAKE_PIC = 'Should a take a picture to remember this person?';
const ASK_PIC_NAME = 'What do you want me to call this person?';
const STOP_MESSAGE = 'Goodbye!';

const Alexa = require('ask-sdk');

// var config = {
//   apiKey: process.env.API_KEY,
//   authDomain: "aleksecurity.firebaseapp.com",
//   databaseURL: "https://aleksecurity.firebaseio.com",
//   projectId: "aleksecurity",
//   storageBucket: "aleksecurity.appspot.com",
//   messagingSenderId: "840580222472"
// };

// firebase.initializeApp(config);

// var db = firebase.database();
// console.log(db);

const WhoIsAtDoorHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'WhosAtTheDoorIntent');
  },
  handle(handlerInput) {
    const speechOutput = RECOGNIZED_FACE;

    return handlerInput.responseBuilder
      //TODO: output name of person from database with `speechOutput`
      .speak(speechOutput) 
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  },
};

const TakePictureHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' || 
    (request.intent.name === 'IntentRequest' &&
    request.intent.name === 'TakePictureIntent');
  },
  handle(handlerInput) {
    //TODO: take picture of person
    
  }
}

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    WhoIsAtDoorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
