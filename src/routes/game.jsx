import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGameData, loadUserData, makeGuess } from "../utils/game.engine";
import Loading from "../components/Loading";
import CountdownTimer from "../components/CountdownTimer";

export default function Game() {
  const { gameId } = useParams();
  const [guess, setGuess] = useState("");
  const { data } = useGameData(gameId);
  const { playerId } = loadUserData();
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
    <div className="main-container">
      <CountdownTimer endTime={data?.time?.end} callback={endGame} />
      <div className="scrabble">
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
          {data?.words ? (
            Object.keys(data.words).map((word, index) => (
              <tr key={index}>
                <td>{word}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>the clock's a-ticking...</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="guess">
        <input
          className={`guess-input ${nudgeWrong ? "wrong-answer" : ""}`}
          placeholder="Your guess"
          onChange={(e) => setGuess(e.target.value)}
          value={guess}
          onKeyDown={(e) => {
            if (e.key === "Enter") validateInput();
          }}
        />
        <button className="guess-button" onClick={validateInput}>
          Guess!
        </button>
      </div>{" "}
    </div>
  ) : (
    <Loading />
  );
}
