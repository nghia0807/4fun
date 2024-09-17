import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  child,
  get,
  getDatabase,
  ref
} from "firebase/database";
import { firebaseConfig } from "../../../data/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const dbRef = ref(database);

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

export const logout = () => {
  return signOut(auth)
    .then(() => {
      return {
        status: "success",
      };
    })
    .catch((error) => {
      return {
        status: "error",
        code: error.code,
        message: error.message,
      };
    });
};