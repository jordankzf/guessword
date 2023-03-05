import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  startGame,
  useGameData,
  loadUserData,
  joinLobby,
  makeGuess,
} from "../utils/game.engine";

function CountdownTimer({ endTime, callback }) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      if (remaining > 0) {
        setRemainingTime(remaining);
      } else {
        setRemainingTime(0);
        clearInterval(intervalId);
        callback();
      }
    }, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, [endTime]);

  const seconds = String(Math.floor(remainingTime / 1000)).padStart(2, "0");
  const milliseconds = String(remainingTime % 1000).padStart(3, "0");

  return (
    <div>
      {seconds}:{milliseconds}
    </div>
  );
}

export default function Game() {
  const { gameId } = useParams();
  const [guess, setGuess] = useState("");
  const { data } = useGameData(gameId);
  const { playerId, playerName } = loadUserData();
  const navigate = useNavigate();

  function endGame() {
    navigate("/end/" + gameId);
  }

  return data ? (
    <div>
      <CountdownTimer endTime={data.time.end} callback={endGame} />
      <div>
        {data.letters.map((letter) => (
          <div>{letter}</div>
        ))}
      </div>
      <table>
        <th>Guessed Words</th>
        {data?.words &&
          Object.keys(data.words).map((word) => (
            <tr>
              <td>{word}</td>
            </tr>
          ))}
      </table>
      <div>
        <input
          placeholder="Your guess"
          onChange={(e) => setGuess(e.target.value)}
        />
      </div>

      <div>
        <button
          onClick={() =>
            makeGuess(gameId, playerId, data?.words, guess, data.letters)
          }
        >
          Guess!
        </button>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
