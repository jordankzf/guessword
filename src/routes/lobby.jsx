import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  startGame,
  useGameData,
  loadUserData,
  joinLobby,
  write,
} from "../utils/game.engine";

export default function Lobby() {
  // const [name, setName] = useState("");
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
    if (gameId && !data?.players?.[playerId])
      joinLobby(gameId, playerId, playerName);
  }, [data]);

  return data ? (
    <div>
      <div>guessword</div>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Players</th>
          </tr>
        </thead>
        <tbody>
          {data.players &&
            Object.entries(data.players).map(([userId, userData]) => (
              <tr key={userId}>
                <td>{userData.name}</td>
                {playerId === userId && (
                  <td>
                    <button
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
      <div>
        <input value={gameURL} />
        <button onClick={() => navigator.clipboard.writeText(gameURL)}>
          Copy
        </button>
      </div>
      <button
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
