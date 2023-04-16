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
                <div className="spinContainer">
                    <div className="wrapper">
                        <div className="spinButton">
                            <div className="spinFrame"></div>
                            <div className="spinBlur">
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
