import { observer } from 'mobx-react';
import React, { useCallback, useLayoutEffect, useState, type ChangeEvent } from 'react';
import BetControls from '../components/game/bet-controls/BetControls';
import { useStore } from '../useStore';

const BetControlsContainer: React.FC = observer(() => {
  const store = useStore();
  const [betValue, setBetValue] = useState(store.minimumBet);
  const { isGameActive, players: { activePlayer } } = store;
  const { betToPayToContinue: minimumBetAmount } = activePlayer;

  useLayoutEffect(() => {
    if (typeof activePlayer === 'undefined') { return; };
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
    if (activePlayer === undefined) {
      return;
    }

    activePlayer.fold(store);
  }, [activePlayer]);

  const handleBetOrCheck = useCallback(() => {
    if (activePlayer === undefined) {
      return;
    }

    if (activePlayer.canCheck) {
      activePlayer.check(store); return;
    }

    if (activePlayer.canSupportBet) {
      activePlayer.supportBet(store);
    }
  }, [activePlayer]);

  const handleRaise = useCallback(() => {
    if (betValue === activePlayer.betToPayToContinue) {
      handleBetOrCheck(); return;
    }

    if (betValue === activePlayer.moneyLeft) {
      handleAllIn(); return;
    }

    activePlayer.raiseBet(store, betValue);
  }, [activePlayer, betValue]);

  const handleAllIn = useCallback(() => {
    activePlayer.allIn(store);
  }, [activePlayer]);

  const handlePeakCards = useCallback(() => {
    activePlayer.cards.forEach(card => { card.show(); });
  }, [activePlayer]);

  const handleUnpeakCards = useCallback(() => {
    activePlayer?.hideCards();
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
  );
});
export default BetControlsContainer;
