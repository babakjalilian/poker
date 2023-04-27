import React from 'react';
import { type CardSymbol, type SuitSymbol } from '../../../types';
import './Card.scss';

export interface CardProps {
  /**
   * Indicates the card cost
   */
  value: CardSymbol
  /**
     * Indicates the card suit
     */
  suit: SuitSymbol
  /**
     * Is card in faded state
     */
  isFaded: boolean
  /**
     * Is card in hidden state
     */
  isHidden: boolean
}

const Card: React.FC<CardProps> = ({ value, suit, isFaded = false, isHidden = false }) => {
  const redSuits: SuitSymbol[] = ['♦', '♥'];
  const isRed = redSuits.includes(suit);
  return (
    <div className={`card ${isHidden ? 'card-hidden' : ''}`}>
      <div className="card-inner">
        <div className={`card-front ${isRed ? 'red' : 'black'} ${isFaded ? 'card-faded' : ''}`}>
          <div className="card-value">{value}</div>
          <div className="card-suit">{suit}</div>
        </div>
        <div className="card-back"></div>
      </div>
    </div>
  );
};
export default Card;
