import { useParams } from 'react-router-dom';
import {useState, useEffect} from "react";
import db from "../utils/firebase";
import { ref, set, onValue, off} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import words from "an-array-of-english-words";

export default function Game() {
    const { gameId } = useParams();
    const [guess, setGuess] = useState('');

    let playerId = localStorage.getItem("guessword_user_id");

    if (!playerId) {
      playerId = uuidv4();
      localStorage.setItem("guessword_user_id", playerId);
    }

      const [data, setData] = useState(null);

    function isValidWord(guess, letters) {
        // Convert the guess and letters to lowercase
        guess = guess.toLowerCase();
        letters = letters.map((letter) => letter.toLowerCase());
      
        // Check if each letter in the guess is in the letters array
        for (let i = 0; i < guess.length; i++) {
          if (!letters.includes(guess[i])) {
            // If the letter is not in the letters array, return false
            return false;
          } else {
            // If the letter is in the letters array, remove it from the array
            letters.splice(letters.indexOf(guess[i]), 1);
          }
        }
      
        // Return true if all the letters in the guess are in the letters array
        if (words.indexOf(guess) !== -1) return true;
      }

      function makeGuess(guess, letters) {
        if (isValidWord(guess, letters)) {
            const score = guess.length;
            set(ref(db, `games/${gameId}/players/${playerId}/score`), (data.players[playerId]?.score ?? 0) + score)

            if (!data.words?.guess) set(ref(db, `games/${gameId}/words/${guess}`), playerId)
        }
      }

    useEffect(() => {
      // Set up a listener for changes to the "games" node
      const gamesRef = ref(db, 'games/' + gameId);
      onValue(gamesRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      });
  
      // Clean up the listener when the component unmounts
      return () => {
        off(gamesRef);
      };
    }, [gameId]);

    
    return data ? <>
    {data.letters.join(" ")}

    {data?.words && Object.keys(data.words)}
    <label>Your guess</label>
    <input onChange={(e) => setGuess(e.target.value)}/>
    <button onClick={() => makeGuess(guess, data.letters)}>Guess!</button>
    </> : <div>Loading...</div>
}