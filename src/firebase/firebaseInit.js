import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
  //the id for my Firebase project account 
    apiKey: "AIzaSyCvD_j3iOlzKQyuFUUY5KLFH09D2ONYdSM",
    authDomain: "ccyblog-40894.firebaseapp.com",
    projectId: "ccyblog-40894",
    storageBucket: "ccyblog-40894.appspot.com",
    messagingSenderId: "872941623600",
    appId: "1:872941623600:web:681bf2a421acb9447450f5"
  };

  //this line is to connect this application to firebase backend
  const firebaseApp = firebase.initializeApp(firebaseConfig)

  //timestamp is required when using fireStore
  const timestamp = firebase.firestore.FieldValue.serverTimestamp

  export {timestamp}
  export default firebaseApp.firestore();