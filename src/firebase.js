import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDT-zGgd3sRiGbKeCTwHJIIEQbp-ss-XHo",
  authDomain: "m-city-app.firebaseapp.com",
  databaseURL: "https://m-city-app.firebaseio.com",
  projectId: "m-city-app",
  storageBucket: "m-city-app.appspot.com",
  messagingSenderId: "574501539724",
  appId: "1:574501539724:web:91ad826aa0ceb0cd"
  };

  firebase.initializeApp(firebaseConfig);

  const firebaseDb = firebase.database();
// here how we can fetching the tables in the firebase  
  const firebaseMatches = firebaseDb.ref('matches');
  const firebasePromotion = firebaseDb.ref('promotions');
  const firebaseTeams = firebaseDb.ref('teams');
  const firebasePlayers = firebaseDb.ref('players');

  
  export {
      firebase,
      firebaseMatches,
      firebasePromotion,
      firebaseTeams,
      firebasePlayers,
      firebaseDb
  }