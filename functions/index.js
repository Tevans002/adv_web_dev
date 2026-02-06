/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

//here we require Ask SDK
const Alexa = require('ask-sdk-core');

//this function will need to greet the user and open a session
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Welcome to My Skill. Ask me for a fact.';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Next, we’ll build GetFactIntentHandler, this function is referring to a
// specific Fact intent which we’ll add in the Alexa Dev console later.
// Suffice to say this will handle the logic behind that specific Intent being
// tripped
const GetFactIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetFactIntent';
  },
  handle(handlerInput) {
    const facts = [
      'A bolt of lightning contains enough energy to toast 100,000 slices of bread.',
      'You can’t hum while holding your nose.',
      'The total weight of ants on Earth once equaled the total weight of all humans.',
      'Wombat poop is cube-shaped.'
    ];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    return handlerInput.responseBuilder
      .speak(randomFact)
      .getResponse();
  }
};

// Then, we’ll build CancelAndStopIntentHandler, the name says it all
const CancelAndStopIntentHandler = {
canHandle(handlerInput) {
return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
&& (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
|| Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
},
handle(handlerInput) {
return handlerInput.responseBuilder
.speak('Goodbye!')
.getResponse();
}
};

// Finally, ErrorHandler, the name says it all here as well
const ErrorHandler = {
canHandle() { return true; },
handle(handlerInput, error) {
console.error(`Error: ${error.message}`);
return handlerInput.responseBuilder
.speak('Sorry, I had trouble connecting to my Firebase brain.')
.getResponse();
}
};

// Create the SDK instance
const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    GetFactIntentHandler,
    CancelAndStopIntentHandler
)
.addErrorHandlers(ErrorHandler)
.create();

// Create a new server, this one called alexaSkill or whatever you wish
exports.alexaSkill = onRequest(async (request, response) => {
  try {
// Alexa sends a POST request. The SDK processes the request body and returns the JSON response.
      const responseEnvelope = await skillBuilder.invoke(request.body);
      response.send(responseEnvelope);
  } catch (error) {
      console.error(error);
      response.status(500).send('Error processing the Alexa request');
  }
});


//LIVESHARE 2/2/26
exports.writeUser = onRequest(async (request, response) => {
    const newUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 28,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(collectionName).add(newUser);
    const userID = docRef.id;

    response.send(`CREATE: Document created wiht ID: ${userID}`)
})

exports.readUser = onRequestasync ( async (request, response)=>{
  const docRef = await db.collection(collectionName).doc("6hZqLTm7UMOCvasmEv0E");
    docRef.get().then(doc=>{
      if(doc.exists){
        response.send(doc)
      }
    })
})

exports.updateUser = onRequestasync ( async (request, response)=>{
  await db.collection(collectionName).doc("6hZqLTm7UMOCvasmEv0E").update({
    afge: 29,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  })
  response.send("Updated age to 29")
})

exports.queryUser = onRequestasync ( async (request, response)=>{
  const snapshot = await db.collection(collectionName).where('age', '>', 25).get();
  var str = ""
  if(snapshot.empty){
    response.sned("No matching Docs")
  }
  else{
    snapshot.forEach(doc=>{
      str += ` - ${doc.id} => ${doc.data().name} (Age: ${doc.data().age})`
    })
    response.send(str);
  }
})

// THIS IS FORE THE DATABASE
const admin = require('firebase-admin');
const { resumeAndPrerender } = require("react-dom/static");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'YOUR_PROJECT_ID',
    privateKey: 'YOUR_PRIVATE_KEY',
    clientEmail: 'YOUR_CLIENT_EMAIL'
  }),
});

const db = admin.firestore();
const docRef = db.collection('users').doc('12345');

docRef.set({
  name: 'John Doe',
});

docRef.get().then(doc => {
  if (doc.exists) {
    console.log(doc.data());
  } else {
    console.llog('No such document!');
  }
});

docRef.delete();

docRef.onSnapshot(doc => {
  console.log(doc.data());
})


