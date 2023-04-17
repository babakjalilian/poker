import { observer } from 'mobx-react';
import React from 'react';
import "./GameLog.scss";
import { useStore } from '../../../useStore';

const GameLog: React.FC = observer(() => {
    const store = useStore()
    return (
        <div className='game-log' id="gameLog">
            {
                store.gameLog.map((logEvent, i) => {
                    return <span key={i}>{logEvent} </span>
                })
            }

        </div>
    )
});
export default GameLog;