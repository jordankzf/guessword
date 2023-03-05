import { useParams, useNavigate } from "react-router-dom";
import { useGameData } from "../utils/game.engine";
import Loading from "../components/Loading";

export default function End() {
  const { gameId } = useParams();
  const { data } = useGameData(gameId);
  const navigate = useNavigate();

  return data ? (
    <div className="main-container">
      <h1>time's up!</h1>
      <table className="end-screen">
        <thead>
          <tr>
            <th>No.</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(data.players)
            .sort((a, b) => b.score - a.score) // sort by score in descending order
            .map((player, index) => (
              <tr key={player.name}>
                <td>{index + 1}</td>
                <td>
                  {index === 0 && "🎉 "}
                  {player.name}
                </td>
                <td>{player.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {/* Return to root to generate a new lobby */}
        <button className="action-button" onClick={() => navigate("/")}>
          New Lobby
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
