import db from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


// const gamesRef = db.ref('games');

function generateLetters() {
  const vowels = ["a", "e", "i", "o", "u"];
  const consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const letters = [];

  // Add at least 2 vowels and 2 consonants
  for (let i = 0; i < 2; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }

  // Add remaining letters
  for (let i = 0; i < 5; i++) {
    const isVowel = Math.random() < 0.5;
    const sourceArray = isVowel ? vowels : consonants;
    letters.push(sourceArray[Math.floor(Math.random() * sourceArray.length)]);
  }

  return letters;
}

function createNewGame(hostId, hostName) {
  const newGame = {
    "status": "PENDING",
    "letters": generateLetters(),
    "time": null,
    "link": uuidv4(),
    "words": {},
    "host": hostId,
    "players": {
      [hostId]: {
        "name": hostName,
        "score": 0
      }
    }
  }
  return newGame
}

export default function Lobby() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  return <div>
    <label>Your name</label>
    <input onChange={(e) => setName(e.target.value)} type="text" />
    <button onClick={() => {
      const gameId = uuidv4();
      set(ref(db, 'games/' + gameId), createNewGame(uuidv4(), name))
      navigate("/game/" + gameId)
    }}>Create new game</button></div>
}