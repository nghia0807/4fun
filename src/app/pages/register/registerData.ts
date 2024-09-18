import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../data/firebaseConfig';
import { error } from 'console';
import { getDatabase, ref, set } from "firebase/database";

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

export const register = (email: string, password: string, phoneNumber: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const userID = userCredential.user?.uid;

      if(userID) {
        const userRef = ref(db, `users/${userID}`);
        set(userRef, {
          email: email,
          password: password,
          phoneNumber: phoneNumber
        }). then(() => {
          console.log("Data saved succesfully");
        }). catch(() => {
          console.log("Data saved failed", error);
        })
      }
    })
    .catch((error) => {
      console.error("Error during registration", error);
    })
}