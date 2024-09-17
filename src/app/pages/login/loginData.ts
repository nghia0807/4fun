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

export const login = (user: string, pass: string) => {
  return setPersistence(auth, browserLocalPersistence).then(() => {
    return signInWithEmailAndPassword(auth, user, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        return {
          status: "success",
          user: user,
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