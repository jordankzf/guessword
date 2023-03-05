import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGameData, loadUserData, makeGuess } from "../utils/game.engine";

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
  const [nudgeWrong, setNudgeWrong] = useState(false);

  function endGame() {
    navigate("/end/" + gameId);
  }

  function validateInput() {
    const success = makeGuess(
      gameId,
      playerId,
      data?.words,
      guess,
      data.letters
    );
    if (!success) {
      setNudgeWrong(true);
      setTimeout(() => {
        setNudgeWrong(false);
      }, 500);
    }
    setGuess("");
  }

  return data ? (
    <div>
      <CountdownTimer endTime={data.time.end} callback={endGame} />
      <div>
        {data.letters.map((letter, index) => (
          <div key={index}>{letter}</div>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Guessed Words</th>
          </tr>
        </thead>
        <tbody>
          {data?.words &&
            Object.keys(data.words).map((word, index) => (
              <tr key={index}>
                <td>{word}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <input
          className={`guess-input ${nudgeWrong ? "wrong-answer" : ""}`}
          placeholder="Your guess"
          onChange={(e) => setGuess(e.target.value)}
          value={guess}
          onKeyDown={(e) => {
            if (e.key === "Enter") validateInput();
          }}
        />
      </div>
      <div>
        <button onClick={validateInput}>Guess!</button>
      </div>{" "}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
