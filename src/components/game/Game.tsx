import { observer } from "mobx-react";
import React, { useEffect } from "react";
import store from "../../Store";
import BetControls from "./bet-controls/BetControls";
import GameLog from "./game-log/GameLog";
import GameTable from "./game-table/GameTable";
import "./Game.scss";
import Player from "./player/Player";

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
                {/* <div className="inside-ring"></div> */}
                <div className="card-container card-container-topmid player-2">
                    <Player playerId={2} />
                </div>
                <div className="card-container card-container-midleft player-1">
                    <Player playerId={1} />
                </div>

                <div className="game-table">
                    <GameTable />
                </div>

                <div className="card-container card-container-midright player-3">
                    <Player playerId={3} />
                </div>
                <div className="card-container card-container-botmid player-0">
                    <Player playerId={0} />
                </div>
            </div>

            <div className="controls-container">
                <div className="gameLogContainer">
                    <GameLog></GameLog>
                </div>
                <BetControls />
            </div>
        </>
    );
});
export default Game;
