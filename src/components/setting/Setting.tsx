import { observer } from "mobx-react";
import React, { ChangeEvent, useCallback } from "react";
import store from "../../Store";
import Link from "../link-button/Link";
import "./Setting.scss";

interface SettingProps {
    name: string;
}

const Settings: React.FC<SettingProps> = observer(() => {
    const setAmountOfHumanPlayers = useCallback((count) => {
        store.setPlayersCount(count);
    }, []);
    const setMinimumBetValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        store.setMinimumBet(+e.target.value);
    }, []);

    const updateStartingMoney = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            store.setInitialDeposit(+e.target.value);
        },
        []
    );

    return (
        <div className="setting-container">
            <div className="settings">
                <div className="table-setting">
                    <div>Player count:</div>
                    <div className="playerCount">
                        <div
                            className="player-count-item noSelect selected"
                            onClick={(e) => setAmountOfHumanPlayers(2)}>
                            {2}
                        </div>
                        <div
                            className="player-count-item noSelect"
                            onClick={(e) => setAmountOfHumanPlayers(3)}>
                            {3}
                        </div>
                        <div
                            className="player-count-item noSelect"
                            onClick={(e) => setAmountOfHumanPlayers(3)}>
                            {4}
                        </div>
                    </div>
                    <div>Starting money:</div>
                    <div>
                        <input
                            type="number"
                            id="startingMoneyInput"
                            value={1000}
                            onChange={(e) => updateStartingMoney(e)}
                        />{" "}
                        €
                    </div>
                    <div>Small blind amount:</div>
                    <div>
                        <input
                            type="number"
                            id="minimumBetValueInput"
                            value={20}
                            onChange={(e) => setMinimumBetValue(e)}
                        />{" "}
                        €
                    </div>
                </div>
                <Link text="play the game!" page="Game" />
            </div>
        </div>
    );
});
export default Settings;
