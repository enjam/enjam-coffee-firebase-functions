const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.FbLikeHandler = functions.database.ref('/likes/{user_id}').onWrite(event => {

//	console.log("Event type: " + event.eventType);
//	if(event.eventType == "providers/google.firebase.database/eventTypes/ref.write"){
//
//	} else {
//		console.log("Unhandled event: " + event.eventType);
//		return;
//	}

//      console.log("OnWrite() called..");
      // Only edit data when it is first created.
//	console.log("before event score: " + event.data.previous.val() + " exists: " + event.data.previous.exists());
      if (event.data.previous.exists()) {
	console.log("User has already liked something... Not updating score..");
        return;
      }

	console.log("userid: " + event.params.user_id);
	var scoreRef = admin.database().ref('/scores/' + event.params.user_id);
	scoreRef.transaction(function(score) {
	    if (score) {
  	        console.log("Score: " + score);
		score=score+10;
	    } else {
		console.log("Score not in db yet...");
		score=10;
	    }
	    return score;
	  });

    });
