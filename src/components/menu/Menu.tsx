import { observer } from "mobx-react";
import React from "react";
import Link from "../link-button/Link";
import GameName from "./game-name/GameName";
import "./Menu.scss";

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
                src={require("../../textures/card_image.png")}
            />
        </div>
    );
});
export default Menu;
