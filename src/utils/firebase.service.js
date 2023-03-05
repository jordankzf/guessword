import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAUXXqEmYfdp_G8LmJ_UnoZ_eIhmPNteCM",
  authDomain: "guessword-game.firebaseapp.com",
  databaseURL: "https://guessword-game-default-rtdb.firebaseio.com",
  projectId: "guessword-game",
  storageBucket: "guessword-game.appspot.com",
  messagingSenderId: "420410168828",
  appId: "1:420410168828:web:34fec1366848e0164f0e79",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
