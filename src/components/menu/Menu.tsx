import { observer } from "mobx-react";
import React from "react";
import Link from "../link-button/Link";
import GameName from "./game-name/GameName";
import "./Menu.scss";

import imageUrl from "../../textures/card_image.png";

interface MenuProps {
    name: string;
}

const Menu: React.FC<MenuProps> = observer(() => {
    return (
        <div className="menu">
            <GameName />
            <Link text="play!" page="Game" />
            <Link text="settings" page="Settings" />
            <img
                className="background-image"
                src={imageUrl}
            />
        </div>
    );
});
export default Menu;
