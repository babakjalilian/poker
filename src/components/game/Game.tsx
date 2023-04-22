import React from 'react';
import BetControlsContainer from '../../modules/BetControlsContainer';
import PlayerContainer from '../../modules/PlayerContainer';
import GameLog from './game-log/GameLog';
import GameTable from './game-table/GameTable';
import './Game.scss';

interface GameProps {
  name: string
}

const Game: React.FC<GameProps> = () => {
  return (
        <>
            <div className="poker-container">
                <div className="poker-table"></div>
                <div className="outside-ring"></div>
                {/* <div className="inside-ring"></div> */}
                <div className="card-container card-container-topmid player-2">
                    <PlayerContainer playerId={2} />
                </div>
                <div className="card-container card-container-midleft player-1">
                    <PlayerContainer playerId={1} />
                </div>

                <div className="game-table">
                    <GameTable />
                </div>

                <div className="card-container card-container-midright player-3">
                    <PlayerContainer playerId={3} />
                </div>
                <div className="card-container card-container-botmid player-0">
                    <PlayerContainer playerId={0} />
                </div>
            </div>

            <div className="game-log-container">
                <GameLog></GameLog>
            </div>
            <BetControlsContainer />
        </>
  );
};
export default Game;
