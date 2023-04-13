import { observer } from 'mobx-react';
import React from 'react';
import "./GameLog.scss";

const GameLog: React.FC = observer(() => {
    return (
        <div className='game-log'>
            <span className='log'>{"20:11:07: < FLOP >"}</span>
            <span className='log'>{"20:11:08: player-1: checks"}</span>
            <span className='log'>{"20:11:08: player-2: checks"}</span>
            <span className='log'>{"20:11:07: player-3: checks"}</span>

        </div>
    )
});
export default GameLog;