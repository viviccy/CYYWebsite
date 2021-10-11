import firebase from "firebase/app"
import "firebase/firestore"

var firebaseConfig = {
  //the id for my Firebase project account
  apiKey: "AIzaSyAKqGEUk4sLRqBORqRJTrFOcSqyusvs5qM",
  authDomain: "cyy-website.firebaseapp.com",
  projectId: "cyy-website",
  storageBucket: "cyy-website.appspot.com",
  messagingSenderId: "229601453766",
  appId: "1:229601453766:web:cb63420f39c035ef8a99c7",
}

//this line is to connect this application to firebase backend
const firebaseApp = firebase.initializeApp(firebaseConfig)

//timestamp is required when using fireStore
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { timestamp }
export default firebaseApp.firestore()
