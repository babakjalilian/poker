import { observer } from 'mobx-react';
import React from 'react';
import Player from '../components/game/player/Player';
import { useStore } from '../useStore';

interface PlayerContainerProps {
  playerId: 0 | 1 | 2 | 3
}

const PlayerContainer: React.FC<PlayerContainerProps> = observer(({ playerId }) => {
  const store = useStore();
  const { isGameActive, winners, players: { playerList, activePlayer, bigBlindPlayer, smallBlindPlayer } } = store;
  const hasGameBeenInitialized = typeof playerList !== 'undefined';
  if (!hasGameBeenInitialized) return <></>;

  const playerAtThisSlot = playerList.find(player => player.id === playerId);
  const isTherePlayerAtThisSlot = typeof playerAtThisSlot !== 'undefined';
  if (!isTherePlayerAtThisSlot) return <></>;

  const isActivePlayer = isGameActive && activePlayer === playerAtThisSlot;
  const isWinnerPlayer = winners?.includes(playerAtThisSlot);
  const isBigBlindPlayer = bigBlindPlayer === playerAtThisSlot;
  const isSmallBlindPlayer = smallBlindPlayer === playerAtThisSlot;
  const { name, moneyLeft, hasFolded, sumOfPersonalBetsInThisRound, cards } = playerAtThisSlot;

  return (
        <Player
            playerId={playerId}
            name={name}
            hasFolded={hasFolded}
            isActivePlayer={isActivePlayer}
            isWinner={isWinnerPlayer}
            isBigBlindPlayer={isBigBlindPlayer}
            isSmallBlindPlayer={isSmallBlindPlayer}
            cards={cards}
            moneyLeft={moneyLeft}
            sumOfPersonalBetsInThisRound={sumOfPersonalBetsInThisRound}
        />
  );
});
export default PlayerContainer;
