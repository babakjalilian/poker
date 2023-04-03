import { observer } from 'mobx-react';
import React from 'react';
import "./App.css";
import Card from './components/Card';
import Game from './components/Game';
import Link from "./components/Link";
import Menu from "./components/Menu";
import Switch from './components/Switch';
import store from "./Store";


export const App: React.FC = observer(() => {
    return (
        <div className="game-background">
            {
                store.currentPage !== "Menu" &&
                <div className="backButton_container">
                    <Link text="⬅ back to menu" page="Menu" />
                </div>
            }
            <Card value={'10'} symbol={"♠"} isFaded={false} isHidden={false} />
            <Switch activePage={store.currentPage} >
                <Menu name="Menu" />
                <Game name="Game" />
            </Switch>
        </div>
    )
});