import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  startGame,
  useGameData,
  loadUserData,
  joinLobby,
  write,
} from "../utils/game.engine";

export default function Lobby() {
  const { gameId } = useParams();
  const { playerId, playerName } = loadUserData();
  const { gameId: newGameId, data } = useGameData(gameId);
  const navigate = useNavigate();
  const gameURL = `${window.location.origin}/${gameId}`;

  // Redirect host to newly created lobby
  useEffect(() => {
    if (!gameId && newGameId) {
      navigate("/" + newGameId);
    }
  }, [newGameId]);

  useEffect(() => {
    if (gameId && !data?.players?.[playerId]) {
      joinLobby(gameId, playerId, playerName);
    }

    if (data?.time?.end) navigate("/game/" + gameId);
  }, [data]);

  return data ? (
    <div className="container">
      <div className="title">guessword</div>
      <table className="table">
        <thead>
          <tr>
            <th colSpan={2}>Players</th>
          </tr>
        </thead>
        <tbody>
          {data.players &&
            Object.entries(data.players).map(([userId, userData]) => (
              <tr key={userId}>
                <td className="name">{userData.name}</td>
                {playerId === userId && (
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => {
                        const newName = window.prompt(
                          "Please enter your name:"
                        );
                        localStorage.setItem("guessword_user_name", newName);
                        write(gameId, `players/${playerId}/name`, newName);
                      }}
                    >
                      ✏️
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="copy-container">
        <input className="copy-input" value={gameURL} />
        <button
          className="copy-button"
          onClick={() => {
            navigator.clipboard.writeText(gameURL);
            alert("Copied!");
          }}
        >
          Copy
        </button>
      </div>
      <button
        className="start-button"
        onClick={() => {
          startGame(gameId);
          navigate("/game/" + gameId);
        }}
        disabled={playerId !== data.host}
      >
        Start game
      </button>
    </div>
  ) : (
    <div>Loading</div>
  );
}
