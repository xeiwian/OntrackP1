// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase");

// Add the Firebase products that you want to use
require("firebase/auth");

var firebaseConfig = {
    apiKey: "AIzaSyCw78YZuS4Tk_mKTM6y5EgxbjTABpreWn0",
    authDomain: "ontrackp1.firebaseapp.com",
    databaseURL: "https://ontrackp1.firebaseio.com",
    projectId: "ontrackp1",
    storageBucket: "ontrackp1.appspot.com",
    messagingSenderId: "416168749073",
    appId: "1:416168749073:web:94952809e854cba6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // Send token to your backend via HTTPS
    // ...
  }).catch(function(error) {
    // Handle error
  });

// idToken comes from the client app
admin.auth().verifyIdToken(idToken)
.then(function(decodedToken) {
  let uid = decodedToken.uid;
  // ...
}).catch(function(error) {
  // Handle error
});