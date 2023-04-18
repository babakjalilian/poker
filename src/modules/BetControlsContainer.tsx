import { observer } from 'mobx-react';
import React, { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { useStore } from '../useStore';
import BetControls from '../components/game/bet-controls/BetControls';


const BetControlsContainer: React.FC = observer(() => {
    const store = useStore();
    const [minBetValue, setMinBetValue] = useState(store.minimumBet);
    const [betValue, setBetValue] = useState(store.minimumBet);
    const [sBetValue, setSBetValue] = useState(String(betValue));
    const { isGameActive, players: { activePlayer } } = store;

    useLayoutEffect(() => {
        if (typeof store.players.activePlayer === "undefined") { return };
        const { betToPayToContinue } = store.players.activePlayer;
        const minimumBetAmount = betToPayToContinue;
        setMinBetValue(minimumBetAmount);
        setBetValue(minimumBetAmount);
        setSBetValue(String(minimumBetAmount));
    }, [store.players.activePlayer, store.activeRound]);

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
        <BetControls
            sBetValue={sBetValue}
            betValue={betValue}
            minBetValue={minBetValue}
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