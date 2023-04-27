import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import Settings from '../components/setting/Setting';
import { useStore } from '../hooks/useStore';

const SettingsContainer: React.FC<{ name: string }> = observer(() => {
  const store = useStore();
  const [areSettingsValid, setAreSettingsValid] = useState(true);
  const [message, setMessage] = useState('good to go!');
  const [startingMoney, setStartingMoney] = useState(String(store.initialDeposit));
  const [minBet, setMinBet] = useState(String(store.minimumBet));

  const { amountOfHumanPlayers } = store;

  const startTheGame = useCallback(() => {
    store.startInitialGame();
  }, []);

  const updateStartingMoney = (startingMonry: number): void => {
    setStartingMoney(startingMonry.toString());
    if (startingMonry <= 0) {
      setMessage('starting money should be greater than 0!');
      setAreSettingsValid(false);
      store.setInitialDeposit(0);
    } else if (startingMonry > 0 && startingMonry < +minBet * 2) {
      setMessage('starting money should be greater than or equal( 2 x small blind) !');
      setAreSettingsValid(false);
      store.setInitialDeposit(0);
    } else {
      setMessage('good to go!');
      setAreSettingsValid(true);
      store.setInitialDeposit(startingMonry);
      store.setMinimumBet(+minBet);
    }
  };

  const updateMinimumBet = (minBetValue: number): void => {
    setMinBet(String(minBetValue));
    if (minBetValue <= 0) {
      setMessage('small blind should be greater than 0!');
      setAreSettingsValid(false);
      store.setMinimumBet(0);
    } else if (minBetValue > 0 && minBetValue * 2 > +startingMoney) {
      setMessage('starting money should be greater than or equal( 2 x small blind) !');
      setAreSettingsValid(false);
      store.setMinimumBet(0);
    } else {
      setMessage('good to go!');
      setAreSettingsValid(true);
      store.setMinimumBet(minBetValue);
    }
  };

  const setAmountOfHumanPlayers = useCallback((count: number) => {
    store.setPlayersCount(count);
  }, []);

  return (
    <Settings
      areSettingsValid={areSettingsValid}
      message={message}
      startingMoney={startingMoney}
      minBet={minBet}
      amountOfHumanPlayers={amountOfHumanPlayers}
      onPressPlay={startTheGame}
      updateStartingMoney={updateStartingMoney}
      updateMinimumBet={updateMinimumBet}
      setAmountOfHumanPlayers={setAmountOfHumanPlayers}

    />
  );
});
export default SettingsContainer;
