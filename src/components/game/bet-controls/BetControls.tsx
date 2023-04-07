import { observer } from 'mobx-react';
import React from 'react';
import "./BetControls.scss";

const BetControls: React.FC = observer(() => {


    return (
        <div className='bet-controls-container noSelect'>
            <div>Player-1</div>
            <div className="controls">
                <div className="min-bet-value">min</div>
                <div className="bet-amount">
                    <input type="number" id="betAmountInput" />
                </div>
                <div className="max-bet-value">max</div>
                <div >money</div>

                <div className='slider-container'>
                    <input type="range" min={0} max={100} id="betSlider" />
                </div>
                <div className="bet-active-player-name">
                    80 €
                </div>
                <div>
                    <div id="foldBtn" className='control-btn noSelect'>fold</div>
                </div>
                <div>
                    <div id="betCheckBtn" className='control-btn noSelect'>
                        bet
                        <br />
                        20
                    </div>
                </div>
                <div></div>
                <div>
                    <div id="all-in-btn" className='control-btn noSelect'>ALL IN</div>
                </div>
                <div className="peak-cards-btn noSelect" >peak cards</div>
            </div>
        </div>
    )
});
export default BetControls;