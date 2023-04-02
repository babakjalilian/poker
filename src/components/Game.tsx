import { observer } from "mobx-react";
import React, { useEffect } from "react";
import store from "../Store";

interface GameProps {
    name: string
};

const Game: React.FC<GameProps> = observer(() => {
    useEffect(() => {
        store.startInitialGame();
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>game works!</div>
    )
});
export default Game;