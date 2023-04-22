import React from 'react';
import Link from '../link-button/Link';
import './Setting.scss';

interface SettingProps {
  amountOfHumanPlayers: number
  startingMoney: string
  minBet: string
  message: string
  areSettingsValid: boolean
  setAmountOfHumanPlayers: (count) => void
  updateStartingMoney: (startingMoney: number) => void
  updateMinimumBet: (minBetValue: number) => void
  onPressPlay: () => void

}

const availablePlayerAmount = [2, 3, 4];

const Settings: React.FC<SettingProps> = (
  {
    amountOfHumanPlayers,
    setAmountOfHumanPlayers,
    updateStartingMoney,
    updateMinimumBet,
    onPressPlay,
    startingMoney,
    minBet,
    message,
    areSettingsValid
  }
) => {
  return (
        <div className="setting-container">
            <div className="settings">
                <div className="table-setting">
                    <div>Player count:</div>
                    <div className="player-count">
                        {
                            availablePlayerAmount.map(count => {
                              return (
                                    <div key={count}
                                        className={`player-count-item  noSelect ${amountOfHumanPlayers === count ? 'selected' : ''}`}
                                        onClick={(e) => { setAmountOfHumanPlayers(count); }}>
                                        {count}
                                    </div>
                              );
                            })
                        }
                    </div>
                    <div>Starting money:</div>
                    <div>
                        <input type="number" id="startingMoneyInput" value={startingMoney} onChange={e => { updateStartingMoney(+e.target.value); }} />
                        {' '}€
                    </div>
                    <div>Small blind amount:</div>
                    <div>
                        <input type="number" id="minimumBetValueInput" value={minBet} onChange={e => { updateMinimumBet(+e.target.value); }} />
                        {' '}€
                    </div>
                </div>
                {message}
                {areSettingsValid ? <Link text="play the game!" page="Game" onPress={onPressPlay} /> : ''}
            </div>
        </div>
  );
};
export default Settings;
