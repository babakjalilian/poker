import { inject, observer } from "mobx-react";
import React, { useCallback } from "react";
import Link from "../link-button/Link";
import GameName from "./game-name/GameName";
import "./Menu.scss";

import imageUrl from "../../textures/card_image.png";
import { StoreType } from "../../types";

interface MenuProps {
    name: string;
    store?: StoreType;
}

const Menu: React.FC<MenuProps> = inject('store')(observer(({ store }) => {
    const startTheGame = useCallback(() => {
        store.startInitialGame();
    }, []);
    return (
        <div className="menu">
            <GameName />
            <Link text="play!" page="Game" onPress={startTheGame} />
            <Link text="settings" page="Settings" />
            <img
                className="background-image"
                src={imageUrl}
            />
        </div>
    );
})
);
export default Menu;
