import { observer } from 'mobx-react';
import React from 'react';
import './App.scss';
import Game from './components/game/Game';
import Link from './components/link-button/Link';
import Menu from './components/menu/Menu';
import SwitchView from './components/switch-view/SwitchView';
import { useStore } from './hooks/useStore';
import SettingsContainer from './modules/SettingContainer';

const App: React.FC = observer(() => {
  const store = useStore();
  return (
    <div className="game-background">
      {store.currentPage !== 'Menu' && (
        <div className="backButton_container">
          <Link text="⬅ back to menu" page="Menu" />
        </div>
      )}
      <SwitchView activePage={store.currentPage}>
        <Menu name="Menu" />
        <Game name="Game" />
        <SettingsContainer name="Settings" />
      </SwitchView>
    </div>
  );
});

export default App;
