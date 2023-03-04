import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Lobby from "./routes/lobby";
import Game from "./routes/game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby/>,
  },
  {
    path: "/game/:gameId",
    element: <Game/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals(sendToVercelAnalytics);
