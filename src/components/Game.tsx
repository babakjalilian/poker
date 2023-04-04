import { observer } from "mobx-react";
import React, { useEffect } from "react";
import store from "../Store";
import Player from "./Player";
import "./styles/Game.scss";

interface GameProps {
  name: string;
}

const Game: React.FC<GameProps> = observer(() => {
  useEffect(() => {
    store.startInitialGame();
  }, []);

  return (
    <>
      <div className="poker-container">
        <div className="poker-table"></div>
        <div className="outside-ring"></div>
        <div className="inside-ring"></div>
        <div className="card-container-topmid">
          <Player playerId={2} />
        </div>
        <div className="card-container-midleft">
          <Player playerId={1} />
        </div>
        <div className="card-container-midright">
          <Player playerId={3} />
        </div>
        <div className="card-container-botmid">
          <Player playerId={0} />
        </div>
      </div>
    </>
  );
});
export default Game;
