import { useState, useEffect } from "react";
import { onValue, ref, off, update, increment } from "firebase/database";
import db from "./firebase.service";
import dictionary from "an-array-of-english-words";

function createNewGame() {
  const { playerId, playerName } = loadUserData();
  const newGame = {
    letters: generateLetters(),
    time: { start: null, end: null },
    words: {},
    host: playerId,
    players: {
      [playerId]: {
        name: playerName,
        score: 0,
      },
    },
  };
  return newGame;
}

export function loadUserData() {
  let playerId = localStorage.getItem("guessword_user_id");
  let playerName = localStorage.getItem("guessword_user_name");

  if (!playerId) {
    playerId = generateWord(4, "-");
    localStorage.setItem("guessword_user_id", playerId);
  }

  if (!playerName) {
    playerName = generateWord();
    localStorage.setItem("guessword_user_name", playerName);
  }

  return { playerId, playerName };
}

function generateWord(words = "1", separator = "") {
  const length = dictionary.length;
  const output = [];

  for (let i = 0; i < words; i++) {
    output.push(dictionary[Math.floor(Math.random() * length)]);
  }
  return output.join(separator);
}

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

export function startGame(gameId) {
  const now = Date.now();
  write(gameId, "time/end", now + 60000);
}

export function joinLobby(gameId, playerId, playerName) {
  write(gameId, `players/${playerId}`, {
    name: playerName,
    score: 0,
  });
}

export function write(gameId, targetPath, newValue) {
  const updates = {};
  updates[`games/${gameId}/${targetPath}`] = newValue;
  update(ref(db), updates);
}

export function useGameData(initialGameId) {
  const [gameId, setGameId] = useState(initialGameId);
  const [data, setData] = useState(null);

  useEffect(() => {
    const gamesRef = ref(db, "games/" + gameId);

    // Set up a listener for changes to the "games" node
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        const newGameId = initialGameId ?? generateWord(3, "-");
        setGameId(newGameId);
        write(newGameId, "", createNewGame());
      }
      setData(data);
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(gamesRef);
    };
  }, [gameId]);

  return { gameId, data };
}

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
  if (dictionary.indexOf(guess) !== -1) return true;
}

export function makeGuess(gameId, playerId, words, guess, letters) {
  if (isValidWord(guess, letters)) {
    const score = guess.length;
    const updates = {};
    updates[`games/${gameId}/players/${playerId}/score`] = increment(score);
    update(ref(db), updates);

    if (!words?.guess) {
      write(gameId, `words/${guess}`, playerId);
      return true;
    }

    return false;
  }
}
