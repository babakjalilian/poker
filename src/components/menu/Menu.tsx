import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import imageUrl from '../../textures/card_image.png';
import { useStore } from '../../useStore';
import Link from '../link-button/Link';
import GameName from './game-name/GameName';
import './Menu.scss';

interface MenuProps {
  name: string
}

const Menu: React.FC<MenuProps> = observer(() => {
  const store = useStore();
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
});
export default Menu;
