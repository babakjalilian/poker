import { observer } from 'mobx-react';
import React, { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { useStore } from '../../../useStore';
import "./BetControls.scss";


interface BetControlsPropType {
    sBetValue: string;
    betValue: number;
    minBetValue: number;
    canSupportBet: boolean;
    canCheck: boolean;
    canRaise: boolean;
    moneyLeft: number;
    betToPayToContinue: number;
    isGameActive: boolean;
    updateBetValue: (e: ChangeEvent<HTMLInputElement>) => void;
    handleFold: () => void;
    handleBetOrCheck: () => void;
    handleRaise: () => void;
    handleAllIn: () => void;
    handlePeakCards: () => void;
    handleUnpeakCards: () => void;
}

const BetControls: React.FC<BetControlsPropType> = observer((
    {
        sBetValue,
        betValue,
        minBetValue,
        canSupportBet,
        canCheck,
        canRaise,
        moneyLeft,
        betToPayToContinue,
        isGameActive,
        updateBetValue,
        handleFold,
        handleBetOrCheck,
        handleRaise,
        handleAllIn,
        handlePeakCards,
        handleUnpeakCards
    }
) => {
    return (
        isGameActive && <div className='bet-controls-container noSelect'>
            <div className="bet-amount-container">
                <div className="min-bet-value-label">min</div>
                <div className="bet-amount">
                    <input type="number" id="betAmountInput" value={sBetValue} onChange={updateBetValue} />
                    <div className='slider-container'>
                        <input type="range" min={minBetValue} max={moneyLeft} value={betValue} id="betAmountSlider" onChange={updateBetValue} />
                    </div>
                </div>
                <div className="max-bet-value-label">max</div>
            </div>
            <div className="action-buttons-container">
                <div className='btn-container'>
                    {(betValue > betToPayToContinue && canRaise) &&
                        <div id="raiseBtn" onClick={handleRaise} className='control-btn noSelect'>
                            RAISE {betValue}
                        </div>
                    }
                </div>
                <div className='btn-container'>
                    <div id="foldBtn" className='control-btn noSelect' onClick={handleFold} >FOLD</div>
                </div>
                <div className='btn-container'>
                    {(canSupportBet || canCheck) &&
                        <div id="betCheckBtn" className='control-btn noSelect' onClick={handleBetOrCheck}>
                            {canCheck ? "CHECK" : "BET"} {betToPayToContinue}
                        </div>
                    }
                </div>
                <div className='btn-container'>
                    {moneyLeft > 0 && <div id="allInBtn" className='control-btn noSelect' onClick={handleAllIn} >ALL IN</div>}
                </div>
            </div>
            <div className="peak-cards-btn-container">
                <div className='btn-container'>
                    <div className="control-btn noSelect" id="peakCardsBtn" onMouseDown={handlePeakCards} onMouseUp={handleUnpeakCards} onMouseLeave={handleUnpeakCards} >PEAK CARDS</div>
                </div>
            </div>
        </div>
    )
});
export default BetControls;