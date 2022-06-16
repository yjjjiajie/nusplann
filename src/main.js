import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYyvdSLgZetR1sqohLJCoJwEViaQJy9Hc",
  authDomain: "nusplan-59da0.firebaseapp.com",
  projectId: "nusplan-59da0",
  storageBucket: "nusplan-59da0.appspot.com",
  messagingSenderId: "1031581571133",
  appId: "1:1031581571133:web:5bf41e6a8bb13d2a4e3254",
  measurementId: "G-MS8Q9MGJM7"
};

initializeApp(firebaseConfig);
createApp(App).use(router).mount('#app')
