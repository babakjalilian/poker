import { observer } from 'mobx-react';
import React from 'react';
import { useStore } from '../../../useStore';
import Card from '../card/Card';
import Button from './button/Button';
import './GameTable.scss';

const GameTable: React.FC = observer(() => {
  const store = useStore();
  return (
        <div className="game-board noSelect">
            {store.isRoundFinished && <Button />}
            <div className="board-cards-container">
                <div className="placeholder-container">
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                    <div className="card-placeholder"></div>
                </div>
                {store.cardsOnTheDesk?.map(({ suitName, cardSymbol, suitSymbol, cardName, isFaded, isHidden }) => {
                  return <Card key={`${suitName}_${cardName}`}
                        value={cardSymbol}
                        suit={suitSymbol}
                        isFaded={isFaded}
                        isHidden={isHidden}
                    />;
                })}
                <br />
            </div>
            <div className="pot-info">
                {store?.sumOfBets} €
            </div>
            <div className="game-info">
                <ul>
                    {store?.gameInfo?.map((message) => (<li key={Math.random()}>{message}</li>))}
                </ul>
            </div>
        </div>
  );
});
export default GameTable;
