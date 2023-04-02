import { observer } from 'mobx-react';
import React from 'react';
import GameName from './GameName';
import Link from "./Link";
import "./styles/Menu.css";

interface MenuProps {
    name: string,
};

const Menu: React.FC<MenuProps> = observer(() => {

    return (
        <div className="menu">
            <GameName />
            <Link text="play!" page="Game" />
            <Link text="settings" page="Settings" />
        </div>
    )
});
export default Menu;