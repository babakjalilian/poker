import React, { useCallback } from 'react';
import store from "../../Store";
import { PageName } from "../../types";
import "./Link.scss";

interface LinkProps {
    text: string,
    page: PageName,
    onPress?: () => void,
};

const Link: React.FC<LinkProps> = ({ text, page, onPress }) => {

    const handleClick = useCallback(() => {
        store.currentPage = page;
        onPress && onPress();
    }, []);

    return (
        <div className="btn" onClick={handleClick}>
            {text}
        </div>
    )
}
export default Link;