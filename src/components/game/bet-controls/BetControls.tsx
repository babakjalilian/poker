import { inject, observer } from 'mobx-react';
import React, { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { StoreType } from '../../../types';
import "./BetControls.scss";

interface BetControlProps {
    store?: StoreType
}

const BetControls: React.FC<BetControlProps> = inject('store')(observer(({ store }) => {
    const [minBetValue, setMinBetValue] = useState(store.minimumBet);
    const [betValue, setBetValue] = useState(store.minimumBet);
    const [sBetValue, setSBetValue] = useState(String(betValue));

    useLayoutEffect(() => {
        if (typeof store.players.activePlayer === "undefined") { return };
        const { betToPayToContinue } = store.players.activePlayer;
        const minimumBetAmount = betToPayToContinue;
        setMinBetValue(minimumBetAmount);
        setBetValue(minimumBetAmount);
        setSBetValue(String(minimumBetAmount));
    }, [store.players.activePlayer]);

    const updateBetValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let sNewValue = target.value;
        let value = parseInt(sNewValue);
        if (value < 0) {
            value = 0;
            sNewValue = "0";
        }
        setBetValue(value);
        setSBetValue(sNewValue);
    }, []);

    const handleFold = useCallback(() => {
        if (!store.players.activePlayer) {
            return;
        }

        store.players.activePlayer.fold(store);
    }, [store.players.activePlayer]);

    const handleBetOrCheck = useCallback(() => {
        if (!store.players.activePlayer) {
            return;
        }

        const { canCheck, canSupportBet } = store.players.activePlayer;
        if (canCheck) {
            return store.players.activePlayer.check(store);
        }

        if (canSupportBet) {
            return store.players.activePlayer.supportBet(store);
        }
    }, [store.players.activePlayer]);

    const handleRaise = useCallback(() => {
        const { moneyLeft, betToPayToContinue } = store?.players?.activePlayer;
        if (betValue === betToPayToContinue) {
            return handleBetOrCheck();
        }

        if (betValue === moneyLeft) {
            return handleAllIn();
        }


        store.players.activePlayer.raiseBet(store, betValue);
    }, [store.players.activePlayer, betValue]);

    const handleAllIn = useCallback(() => {
        store.players.activePlayer.allIn(store);
    }, [store.players.activePlayer]);

    const handlePeakCards = useCallback(() => {
        store.players.activePlayer.cards.forEach(card => card.show());
    }, [store.players.activePlayer]);

    const handleUnpeakCards = useCallback(() => {
        store.players?.activePlayer?.hideCards()
    }, [store.players.activePlayer]);


    return (
        store.isGameActive && <div className='bet-controls-container noSelect'>
            <div>{store.players.activePlayer?.name}</div>
            <div className="controls">
                <div className="min-bet-value-label">min</div>
                <div className="bet-amount">
                    <input type="number" id="betAmountInput" value={sBetValue} onChange={updateBetValue} />
                </div>
                <div className="max-bet-value-label">max</div>
                <div >money</div>

                <div className='slider-container'>
                    <input type="range" min={minBetValue} max={store.players.activePlayer?.moneyLeft} value={betValue} id="betSlider" onChange={updateBetValue} />
                </div>
                <div className="player-money-left">
                    {store.players.activePlayer?.moneyLeft} €
                </div>
                <div>
                    <div id="foldBtn" className='control-btn noSelect' onClick={handleFold} >fold</div>
                </div>
                <div>
                    {(store.players.activePlayer?.canSupportBet || store.players.activePlayer?.canCheck) &&
                        <div id="betCheckBtn" className='control-btn noSelect' onClick={handleBetOrCheck}>
                            {store.players.activePlayer?.canCheck ? "check" : "bet"}
                            <br />
                            {store.players.activePlayer?.betToPayToContinue}
                        </div>
                    }
                </div>
                <div>
                    {(betValue > store.players?.activePlayer.betToPayToContinue && store.players?.activePlayer?.canRaise) &&
                        <div id="raiseBtn" onClick={handleRaise} className='control-btn noSelect'>
                            raise
                            <br />
                            {betValue}
                        </div>
                    }
                </div>
                <div>
                    {store.players?.activePlayer?.moneyLeft > 0 && <div id="allInBtn" className='control-btn noSelect' onClick={handleAllIn} >ALL IN</div>}
                </div>
                <div className="peak-cards-btn noSelect" onMouseDown={handlePeakCards} onMouseUp={handleUnpeakCards} onMouseLeave={handleUnpeakCards} >peak cards</div>
            </div>
        </div>
    )
}));
export default BetControls;