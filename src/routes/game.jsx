import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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

  function validateInput() {
    const success = makeGuess(
      gameId,
      playerId,
      data?.words,
      guess,
      data.letters
    );
    // Violently shake the input field if the user's guess is incorrect
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
      <CountdownTimer
        endTime={data?.time?.end}
        // Transition to end screen once the timer runs out
        callback={() => navigate("/end/" + gameId)}
      />
      <div className="scrabble">
        {/* Loop to populate screen with letter tiles */}
        {data.letters.map((letter, index) => (
          // Users may click on tiles instead of typing
          <div onClick={() => setGuess(guess + letter)} key={index}>
            {letter}
          </div>
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
              {/* Placeholder when there are no guesses */}
              <td>the clock's a-ticking...</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="guess">
        <input
          className={`guess-input ${nudgeWrong && "wrong-answer"}`}
          placeholder="Your guess"
          onChange={(e) => setGuess(e.target.value)}
          value={guess}
          // Attempt at accessibility
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
