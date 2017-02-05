'use strict';

/**
 * This skill makes Alexa act as a combination between a caring friend and a therapist.
 * She will talk with you and support you through difficult times.
 */

// --------------- Helpers that build all of the responses -----------------------

var listenMode = false;
const stdRepromptText = "Hey, are you ok? If you don't want to talk anymore, that's ok too.";
const stdResponses = ["Tell me more.", "Oh, can you tell me more?", "How come?", "Oh, I see."];

const goodEmotions = ["good", "great", "excellent", "amazing", "super", "splendid", "happy"];
const neutralEmotions = ["ok", "okay", "alright", "decent", "fine"];
const badEmotions = ["bad", "terrible", "sad", "depressed", "depression", "miserable", "stress", "stressed", "stressed out"];
const suicideStates = ["die", "dying", "suicide", "suicidal", "end my life", "committing suicide", "commit suicide", "kill myself", "kill"];
const suicideResponses = ["Please don't do that. You matter very much and so many people would miss you. Please call the National Suicide Hotline at 1 800 273 8255 to talk to someone about it. Things may be looking down, but I promise that they can get better. Please call 1 800 273 8255."];

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const alexaResponses = ["Hi,", "Hello", "Hey"];
    const askResponses = ["How are you doing?", "How's everything going?", "How are you?"];
    const speechOutput = randElement(alexaResponses) + " I'm Doctor Alexa. " + randElement(askResponses);
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Hey, are you ok? You don\'t have to be scared talking to me.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const stopResponses = [
        "Thank you for talking to me. I hope you have a nice day!",
        "I'm glad that I was able to talk to you, I hope you have a great day!",
        "Thanks for the talk friend, see you later!"
        ];
    const speechOutput = randElement(stopResponses);
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



/**
 * Respond to action intents
 */
function respondToAction(intent, session, callback) {
    const repromptText = "Hey, are you ok? If you don't want to talk anymore, that's ok too.";
    const action = intent.slots.Action.value;
    const sessionAttributes = {};
    let shouldEndSession = false;
    const startingResponses = ["Tell me more.", "Oh, can you tell me more?", "How come?"];
    let speechOutput = randElement(startingResponses);
    

    const bullyResponses = ["Have you tried talking to a teacher or counselor about this?", "You should try talking to someone in private about this and see if they can help you through this", "Remember that there are always people supporting you, even if it doesn't seem like it."];
    const struggleResponses = ["I know it's hard to see now, but things will get better", "That's unfortunate, but remember that difficult times will make you stronger", "Life always has its ups and downs. Brighter times are on the horizon!"];
    const schoolResponses = ["School is important, but remember that it isn't everything", "Don't forget that you aren't defined by your grades."];
    const familyResponses = ["Your friends and family are always there for you, even when it's hard to see that.", "Those who matter don't mind and those who mind don't matter. You can get through this!", "Everything will be alright and will work out in the end, don't worry!"];

    const bullyStates = ["bully", "bullied", "bullying", "picked on", "called names", "harass", "harassed", "attack", "attacked"];
    const struggleStates = ["going through a hard time", "depression", "crippling depression", "struggling", "struggle"];
    const schoolStates = ["school", "grades", "academics"];
    const familyStates = ["friend","friends","family's","family"];

    if (bullyStates.indexOf(action) > -1) {
        speechOutput = randElement(bullyResponses);
    } else if(struggleStates.indexOf(action) > -1) {
        speechOutput = randElement(struggleResponses);
    } else if(schoolStates.indexOf(action) > -1) {
        speechOutput = randElement(schoolResponses);
    } else if(familyStates.indexOf(action) > -1) {
        speechOutput = randElement(familyResponses);
    } else if(suicideStates.indexOf(action) > -1) {
        speechOutput = randElement(suicideResponses);
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}



function createTraitAttributes(trait) {
    return {
        trait,
    };
}



/**
 * Respond to emotional intents
 */
function respondToEmotion(intent, session, callback) {
    listenMode = true;
    const repromptText = stdRepromptText;
    const emotionSlot = intent.slots.Emotion;
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = randElement(stdResponses);
    
    if (emotionSlot) {
        const emotion = emotionSlot.value;
        sessionAttributes = createTraitAttributes(emotion);
            
        const goodResponses = ["That's great to hear! ", `I'm glad to hear that you're ${emotion}! `];
        const neutralResponses = ["Oh, is there anything you want to tell me about? ", "Is there anything you want to talk about? "];
        const badResponses = [`Oh, I'm sorry to hear that you're ${emotion}. I'm here to listen if you want to talk about it. `, "I'm here for you, you can tell me what's going on if you feel comfortable with that. "];
        
        if (emotion == "tired") {
            speechOutput = "It's still early in the day, but you can make sure to get to bed early tonight.";
        } else if (goodEmotions.indexOf(emotion) > -1) {
            speechOutput = randElement(goodResponses) + " What made you feel that way?";
        } else if(neutralEmotions.indexOf(emotion) > -1) {
            speechOutput = randElement(neutralResponses);
        } else if(badEmotions.indexOf(emotion) > -1) {
            speechOutput = randElement(badResponses);
        } else if (suicideStates.indexOf(emotion) > -1) {
            speechOutput = randElement(suicideResponses);
        }
    }
    
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}



/**
 * Respond to user discussing something after being prompted to talk more
 */
function respondAfterListen(intent, session, callback) {
    listenMode = false;
    let trait;
    const repromptText = stdRepromptText;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = randElement(stdResponses);
    
    if (session.attributes) {
        trait = session.attributes.trait;
    }

    if (trait) {
        const goodResponses = [`Ah, so that's why you're ${trait}!`, `Great, that makes me feel ${trait} too!`];
        const neutralResponses = [`Ah, I see. Sounds pretty typical.`, `Oh ok, thanks for sharing that with me.`];
        const badResponses = [`I totally understand, that would make me feel ${trait} too. Sorry it has to be that way, but it will definitely pick up soon!`,
            `Oh, so that's why you feel ${trait}. Really sorry to hear that, things will definitely get better!`];
        if (goodEmotions.indexOf(trait) > -1) {
            speechOutput = randElement(goodResponses);
        } else if(neutralEmotions.indexOf(trait) > -1) {
            speechOutput = randElement(neutralResponses);
        } else if(badEmotions.indexOf(trait) > -1) {
            speechOutput = randElement(badResponses);
        }
    }
    
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}



/**
 * Respond to "No"
 */
function respondToNo(intent, session, callback) {
    const repromptText = stdRepromptText;
    let sessionAttributes = {};
    let shouldEndSession = false;
    const noResponses = ["Sorry, I didn't mean to bother you.", "Apologies, I didn't mean to intrude."];
    let speechOutput = randElement(noResponses) + " You can say goodbye if you want to go.";
    
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}



// ---------------- Misc ------------------------
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    
    // Dispatch to your skill's intent handlers
    if (intentName === 'NoIntent') {
        respondToNo(intent, session, callback);
    } else if(listenMode && intentName != 'AMAZON.HelpIntent' && intentName != 'AMAZON.StopIntent' && intentName != 'AMAZON.CancelIntent') {
        respondAfterListen(intent, session, callback);
    } else if (intentName === 'ActionIntent') {
        respondToAction(intent, session, callback);
    } else if (intentName === 'EmotionIntent') {
        respondToEmotion(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};