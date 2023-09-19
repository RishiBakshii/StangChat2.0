// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getMessaging} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDf-ScgpQzZ0pVTO14q6hBvuvk8fQs3VWQ",
  authDomain: "stangchat-push-notifications.firebaseapp.com",
  projectId: "stangchat-push-notifications",
  storageBucket: "stangchat-push-notifications.appspot.com",
  messagingSenderId: "358495284573",
  appId: "1:358495284573:web:cb3195ab13e1c1b8f90cb4",
  measurementId: "G-DJ9E5XPPNL"
};


const app = initializeApp(firebaseConfig);
export const messaging=getMessaging(app)