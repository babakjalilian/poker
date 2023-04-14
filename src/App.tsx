import { observer } from "mobx-react";
import React from "react";
import "./App.scss";
import Game from "./components/game/Game";
import Link from "./components/link-button/Link";
import Menu from "./components/menu/Menu";
import Settings from "./components/setting/Setting";
import Switch from "./components/switch/Switch";
import { useStore } from "./useStore";

const App: React.FC = observer(() => {
    const store = useStore();
    return (

        <div className="game-background">
            {store.currentPage !== "Menu" && (
                <div className="backButton_container">
                    <Link text="⬅ back to menu" page="Menu" />
                </div>
            )}
            {/* <Card value={'10'} suit={"♠"} isFaded={true} isHidden={false} /> */}
            <Switch activePage={store.currentPage}>
                <Menu name="Menu" />
                <Game name="Game" />
                <Settings name="Settings" />
            </Switch>
        </div>
    );
});

export default App;
