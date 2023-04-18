import { observer } from 'mobx-react';
import React, { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { useStore } from '../useStore';
import BetControls from '../components/game/bet-controls/BetControls';


const BetControlsContainer: React.FC = observer(() => {
    const store = useStore();
    const [betValue, setBetValue] = useState(store.minimumBet);
    const { isGameActive, players: { activePlayer } } = store;
    const { betToPayToContinue: minimumBetAmount } = activePlayer;

    useLayoutEffect(() => {
        if (typeof activePlayer === "undefined") { return };
        setBetValue(minimumBetAmount);
    }, [activePlayer, store.activeRound]);

    const updateBetValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newValue = +e.target.value;
        if (newValue < 0) {
            newValue = 0;
        }
        setBetValue(newValue);
    }, []);

    const handleFold = useCallback(() => {
        if (!activePlayer) {
            return;
        }

        activePlayer.fold(store);
    }, [activePlayer]);

    const handleBetOrCheck = useCallback(() => {
        if (!activePlayer) {
            return;
        }

        if (activePlayer.canCheck) {
            return activePlayer.check(store);
        }

        if (activePlayer.canSupportBet) {
            return activePlayer.supportBet(store);
        }
    }, [activePlayer]);

    const handleRaise = useCallback(() => {
        if (betValue === activePlayer.betToPayToContinue) {
            return handleBetOrCheck();
        }

        if (betValue === activePlayer.moneyLeft) {
            return handleAllIn();
        }


        activePlayer.raiseBet(store, betValue);
    }, [activePlayer, betValue]);

    const handleAllIn = useCallback(() => {
        activePlayer.allIn(store);
    }, [activePlayer]);

    const handlePeakCards = useCallback(() => {
        activePlayer.cards.forEach(card => card.show());
    }, [activePlayer]);

    const handleUnpeakCards = useCallback(() => {
        activePlayer?.hideCards()
    }, [activePlayer]);

    return (
        <BetControls
            betValue={betValue}
            canSupportBet={activePlayer.canSupportBet}
            canCheck={activePlayer.canCheck}
            canRaise={activePlayer.canRaise}
            moneyLeft={activePlayer.moneyLeft}
            betToPayToContinue={activePlayer.betToPayToContinue}
            isGameActive={isGameActive}
            updateBetValue={updateBetValue}
            handleFold={handleFold}
            handleBetOrCheck={handleBetOrCheck}
            handleRaise={handleRaise}
            handleAllIn={handleAllIn}
            handlePeakCards={handlePeakCards}
            handleUnpeakCards={handleUnpeakCards}
        ></BetControls>
    )

});
export default BetControlsContainer;