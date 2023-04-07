import { observer } from 'mobx-react';
import React from 'react';
import "./GameLog.scss";

const GameLog: React.FC = observer(() => {
    return (
        <div className='game-log'>
            <span className='log'>{"20:11:07: < TURN >"}</span>
            <span className='log'>{"20:11:07: player-3: checks"}</span>
            <span className='log'>{"20:11:08: player-1: checks"}</span>
            <span className='log'>{"20:11:08: player-2: checks"}</span>
            <span className='log'>{"20:11:08: < RIVER >"}</span>
            <span className='log'>{"20:11:22: player-3: checks"}</span>
            <span className='log'>{"20:11:22: player-1: checks"}</span>
            <span className='log'>{"20:11:22: player-2: checks"}</span>
            <span className='log'>{"20:11:22: player-2 wins 60€ [straight]"}</span>
            <span className='log'>{"20:11:28: <<< GAME START >>>"}</span>
            <span className='log'>{"20:11:28: < BLIND CALL >"}</span>
            <span className='log'>{"20:11:28: player-3: big blind (+20)"}</span>
            <span className='log'>{"20:11:28: player-1: small blind (+10)"}</span>
        </div>
    )
});
export default GameLog;