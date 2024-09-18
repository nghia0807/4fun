import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "../../../data/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const login = (email: string, pass: string) => {
  return setPersistence(auth, browserLocalPersistence).then(() => {
    return signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const userID = userCredential.user;
        return {
          status: "success",
          user: userID
        };
      })
      .catch((error) => {
        return {
          status: "error",
          code: error.code,
          message: error.message,
        };
      });
  });
};