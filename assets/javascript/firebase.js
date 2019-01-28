
  var app_fireBase = {};
  
//wrapping it in a self-contained function
  (function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBzU39dhtEHuNvwx_m6u0IfGjN01MF2smY",
        authDomain: "naps-cc521.firebaseapp.com",
        databaseURL: "https://naps-cc521.firebaseio.com",
        projectId: "naps-cc521",
        storageBucket: "naps-cc521.appspot.com",
        messagingSenderId: "525454370509"
      };
      firebase.initializeApp(config);
      app_fireBase = firebase;
  })()