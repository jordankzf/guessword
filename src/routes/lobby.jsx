import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  startGame,
  useGameData,
  loadUserData,
  joinLobby,
  write,
} from "../utils/game.engine";
import Loading from "../components/Loading";

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
    <div className="main-container">
      <h1>guessword</h1>
      <table>
        <thead>
          <tr>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {data.players &&
            Object.entries(data.players).map(([userId, userData]) => (
              <tr key={userId}>
                <td>
                  {data.host === userId && "👑 "}
                  {userData.name}{" "}
                  {playerId === userId && (
                    <button
                      className="pencil"
                      onClick={() => {
                        const newName = window.prompt(
                          "Please enter your name:"
                        );

                        if (newName) {
                          localStorage.setItem("guessword_user_name", newName);
                          write(gameId, `players/${playerId}/name`, newName);
                        }
                      }}
                    >
                      ✏️
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="share-game">
        <input readOnly value={gameId} />
        <button
          onClick={() => {
            navigator.clipboard.writeText(gameURL);
            alert("Copied!");
          }}
        >
          Copy
        </button>
      </div>
      <button
        onClick={() => {
          startGame(gameId);
          navigate("/game/" + gameId);
        }}
        disabled={playerId !== data.host}
        className="action-button"
      >
        Start game
      </button>
    </div>
  ) : (
    <Loading />
  );
}
