import { useState, useEffect } from "react";
import { onValue, ref, off, update, increment } from "firebase/database";
import db from "./firebase.service";
import dictionary from "an-array-of-english-words";

// Scaffolding for a new game
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

// Use localStorage to save and retrieve userId and username
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

// English version of uuid lol
// I would use diceware for "nicer" words,
// but since we already have "an-array-of-english-words"
// imported, let's use that instead.
function generateWord(words = "1", separator = "") {
  const length = dictionary.length;
  const output = [];

  for (let i = 0; i < words; i++) {
    output.push(dictionary[Math.floor(Math.random() * length)]);
  }
  return output.join(separator);
}

// Generate 9 random letters
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

// Start the game
export function startGame(gameId) {
  const now = Date.now();
  // Game lasts 60 seconds from start time
  write(gameId, "time/end", now + 60000);
}

// Enter a lobby
export function joinLobby(gameId, playerId, playerName) {
  write(gameId, `players/${playerId}`, {
    name: playerName,
    score: 0,
  });
}

// Write to the firebase real-time database
export function write(gameId, targetPath, newValue) {
  const updates = {};
  updates[`games/${gameId}/${targetPath}`] = newValue;
  // Use update instead of set, to allow concurrency
  update(ref(db), updates);
}

// Custom hook to listen to game data (reactive!)
export function useGameData(initialGameId) {
  const [gameId, setGameId] = useState(initialGameId);
  const [data, setData] = useState(null);

  useEffect(() => {
    const gamesRef = ref(db, "games/" + gameId);

    // Set up a listener for changes to the "games" node
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      // If the lobby doesn't exist, create it
      if (!data) {
        // If a gameId isn't provided, generate a random one
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
  }, [gameId, initialGameId]);

  return { gameId, data };
}

// Check if the guessed word comprises of the letters given
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

  return true;
}

// Make a guess
export function makeGuess(gameId, playerId, words, guess, letters) {
  // The guessed word corresponds with the letters given AND is an English word
  // if (isValidWord(guess, letters) && dictionary.indexOf(guess) !== -1) {

  // Temporarily disable dictionary verification for Guy to test
  if (isValidWord(guess, letters)) {
    // Credit the player if it hasn't been guessed before
    if (!words?.[guess]) {
      write(gameId, `words/${guess}`, playerId);
      write(gameId, `players/${playerId}/score`, increment(guess.length));
    }
    // The guess is correct even if it has been guessed before
    return true;
  }
  // Incorrect guess
  return false;
}
