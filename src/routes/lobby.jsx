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
  // Ideally, we would use a store to allow a persistent state to avoid this anti-pattern
  // With a store, we can pass the game data across screens instead of having to load it every screen
  const { gameId: newGameId, data } = useGameData(gameId);
  const navigate = useNavigate();

  // Redirect host to newly created lobby
  useEffect(() => {
    if (!gameId && newGameId) {
      navigate("/" + newGameId);
    }
  }, [newGameId]);

  // Login the user
  useEffect(() => {
    // If game exists, and user hasn't logged in yet
    if (gameId && !data?.players?.[playerId]) {
      joinLobby(gameId, playerId, playerName);
    }

    // Redirect user to game if it has already started
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
          {/* Firebase LOVES objects (well, it is faster so I understand why) */}
          {/* we need to convert it to an array to allow mapping */}
          {data.players &&
            Object.entries(data.players).map(([userId, userData]) => (
              <tr key={userId}>
                <td>
                  {/* Add a crown to indicate that the user is a host */}
                  {data.host === userId && "👑 "}
                  {userData.name}{" "}
                  {/* Add a pencil to allow the current user to edit their name */}
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
            // Copy game URL to clipboard
            navigator.clipboard.writeText(
              `${window.location.origin}/${gameId}`
            );
            alert("Copied!");
          }}
        >
          Copy
        </button>
      </div>
      <button
        onClick={() => {
          startGame(gameId);
        }}
        // Only the host is allowed to start the game
        disabled={playerId !== data.host}
        className="action-button"
      >
        Start game
      </button>
    </div>
  ) : (
    // Show loading screen when the game data is not loaded yet
    <Loading />
  );
}
