import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../data/firebaseConfig";
import { Auth, browserLocalPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, UserCredential } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const register = (user: string, pass: string) => {
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return createUserWithEmailAndPassword(auth, user, pass)
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
