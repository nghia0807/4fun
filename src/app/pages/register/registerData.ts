import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../data/firebaseConfig';
import { getDatabase, ref, set } from "firebase/database";

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

export const submitRegister = (email: string, password: string, phoneNumber: string, name: string, address: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const userID = userCredential.user?.uid;

      if(userID) {
        const userRef = ref(db, `users/${userID}`);
        set(userRef, {
          email: email,
          phoneNumber: phoneNumber,
          name: name,  // New
          address: address  // New
        })
        .then(() => {
          console.log("Data saved successfully");
        })
        .catch((error) => {
          console.log("Data saved failed", error);
        })
      }

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
      }
    })
}

//thêm họ tên, địa chỉ, bỏ username