
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDf-ScgpQzZ0pVTO14q6hBvuvk8fQs3VWQ",
  authDomain: "stangchat-push-notifications.firebaseapp.com",
  projectId: "stangchat-push-notifications",
  storageBucket: "stangchat-push-notifications.appspot.com",
  messagingSenderId: "358495284573",
  appId: "1:358495284573:web:cb3195ab13e1c1b8f90cb4",
  measurementId: "G-DJ9E5XPPNL"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging()


messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});