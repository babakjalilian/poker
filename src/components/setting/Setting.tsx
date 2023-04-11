import { observer } from "mobx-react";
import React, { ChangeEvent, useCallback, useState } from "react";
import store from "../../Store";
import Link from "../link-button/Link";
import "./Setting.scss";

interface SettingProps {
    name: string;
}

const availablePlayerAmount = [2, 3, 4];

const Settings: React.FC<SettingProps> = observer(() => {
    const [areSettingsValid, setAreSettingsValid] = useState(true);
    const [message, setMessage] = useState("good to go!");
    const [startingMoney, setStartingMoney] = useState(String(store.initialDeposit));
    const [minBet, setMinBet] = useState(String(store.minimumBet));

    const { amountOfHumanPlayers } = store;

    const updateStartingMoney = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = parseInt(e.target.value) || "";
        setStartingMoney(newValue.toString());
        if (newValue <= 0) {
            setMessage("starting money should be greater than 0!")
            setAreSettingsValid(false);
            store.setInitialDeposit(0);
        } else if (newValue > 0 && newValue < +minBet * 2) {
            setMessage("starting money should be greater than or equal( 2 x small blind) !")
            setAreSettingsValid(false);
            store.setInitialDeposit(0);
        } else {
            setMessage("good to go!")
            setAreSettingsValid(true);
            store.setInitialDeposit(+newValue);
        }
    };

    const updateMinimumBet = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = parseInt(e.target.value) || "";
        setMinBet(String(newValue));
        if (newValue <= 0) {
            setMessage("small blind should be greater than 0!")
            setAreSettingsValid(false);
            store.setMinimumBet(0);
        } else if (newValue > 0 && +newValue * 2 > +startingMoney) {
            setMessage("starting money should be greater than or equal( 2 x small blind) !")
            setAreSettingsValid(false);
            store.setMinimumBet(0);
        } else {
            setMessage("good to go!");
            setAreSettingsValid(true);
            store.setMinimumBet(+newValue);
        }
    };

    const setAmountOfHumanPlayers = useCallback((count: number) => {
        store.setPlayersCount(count);
    }, []);


    return (
        <div className="setting-container">
            <div className="settings">
                <div className="table-setting">
                    <div>Player count:</div>
                    <div className="playerCount">
                        {
                            availablePlayerAmount.map(count => {
                                return (
                                    <div key={count}
                                        className={`player-count-item  noSelect ${amountOfHumanPlayers === count ? "selected" : ""}`}
                                        onClick={(e) => setAmountOfHumanPlayers(count)}>
                                        {count}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>Starting money:</div>
                    <div>
                        <input type="number" id="startingMoneyInput" value={startingMoney} onChange={updateStartingMoney} />
                        {" "}€
                    </div>
                    <div>Small blind amount:</div>
                    <div>
                        <input type="number" id="minimumBetValueInput" value={minBet} onChange={updateMinimumBet} />
                        {" "}€
                    </div>
                </div>
                {message}
                {areSettingsValid ? <Link text="play the game!" page="Game" /> : ""}
            </div>
        </div>
    );
});
export default Settings;
