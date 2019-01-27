

// Initialize Firebase
var config = {
apiKey: "AIzaSyBbYihzv8MsV7GaD2d2YgFvnH8s9Yv2RKU",
authDomain: "aleksecurity.firebaseapp.com",
databaseURL: "https://aleksecurity.firebaseio.com",
projectId: "aleksecurity",
storageBucket: "aleksecurity.appspot.com",
messagingSenderId: "840580222472"
};
firebase.initializeApp(config);
data = firebase.database();



console.log(data);
