import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { useStore } from "../../../../useStore";
import "./Button.scss";



const Button: React.FC = observer(
    () => {
        const store = useStore();
        const handleClick = useCallback(
            () => {
                if (store.isRoundFinished && store.mustGameBeRestarted) {
                    store.startInitialGame();
                } else {
                    store.continueGame();
                }
            },
            [],
        )
        return (
            <div className="container" onClick={handleClick}>
                <div className="spin-container">
                    <div className="wrapper">
                        <div className="spin-button">
                            <div className="spin-frame"></div>
                            <div className="spin-blur">
                                {!store.mustGameBeRestarted && <div className="play-icon" ></div>}
                                {store.mustGameBeRestarted && <div className="pause-icon" >&#8634;</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
export default Button;
