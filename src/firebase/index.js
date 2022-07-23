import { initializeApp } from 'firebase/app';
import { getFirestore, collection} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDYyvdSLgZetR1sqohLJCoJwEViaQJy9Hc",
    authDomain: "nusplan-59da0.firebaseapp.com",
    projectId: "nusplan-59da0",
    storageBucket: "nusplan-59da0.appspot.com",
    messagingSenderId: "1031581571133",
    appId: "1:1031581571133:web:5bf41e6a8bb13d2a4e3254",
    measurementId: "G-MS8Q9MGJM7"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);


export {
    db,
}
