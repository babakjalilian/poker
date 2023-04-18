import { observer } from "mobx-react";
import React from "react";
import GameLog from "./game-log/GameLog";
import GameTable from "./game-table/GameTable";
import "./Game.scss";
import Player from "./player/Player";
import BetControlsContainer from "../../modules/BetControlsContainer";

interface GameProps {
    name: string;
}

const Game: React.FC<GameProps> = observer(() => {

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

            <div className="game-log-container">
                <GameLog></GameLog>
            </div>
            <BetControlsContainer />
        </>
    );
});
export default Game;
