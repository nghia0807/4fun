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
        const email = userCredential.user;
        return {
          status: "success",
          user: email,
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