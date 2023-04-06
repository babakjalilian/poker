import { observer } from "mobx-react";
import React, { useEffect } from "react";
import store from "../../Store";
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
                <div className="inside-ring"></div>
                <div className="card-container card-container-topmid">
                    <Player playerId={2} />
                </div>
                <div className="card-container card-container-midleft">
                    <Player playerId={1} />
                </div>

                <div>
                    <GameTable />
                </div>

                <div className="card-container card-container-midright">
                    <Player playerId={3} />
                </div>
                <div className="card-container card-container-botmid">
                    <Player playerId={0} />
                </div>
            </div>
        </>
    );
});
export default Game;
