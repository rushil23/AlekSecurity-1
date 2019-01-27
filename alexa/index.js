/* eslint-disable  func-names */
/* eslint-disable  no-console */

const SKILL_NAME = 'Door Query';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const RECOGNIZED_FACE = 'The person at the door is: ';
const DOES_NOT_RECOGNIZE = 'I don\'t recognize this person';
const ASK_OPEN = 'Should I open the door?';
const ASK_TAKE_PIC = 'Should a take a picture to remember this person?';
const ASK_PIC_NAME = 'What do you want me to call this person?';
const STOP_MESSAGE = 'Goodbye!';

const Alexa = require('ask-sdk');

const WhoIsAtDoorHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'WhosAtTheDoorIntent');
  },
  handle(handlerInput) {
    // const factArr = data;
    // const factIndex = Math.floor(Math.random() * factArr.length);
    // const randomFact = factArr[factIndex];
    const speechOutput = RECOGNIZED_FACE;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  },
};

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
