import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  startGame,
  useGameData,
  loadUserData,
  joinLobby,
  makeGuess,
} from "../utils/game.engine";

export default function End() {
  const { gameId } = useParams();
  const { data } = useGameData(gameId);
  const navigate = useNavigate();

  return data ? (
    <div className="end-screen">
      <div>time's up!</div>
      <table>
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
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => navigate("/")}>New Lobby</button>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
}
