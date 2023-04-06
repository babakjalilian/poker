import React, { useCallback } from 'react';
import store from "../../Store";
import { PageName } from "../../types";
import "./Link.css";

interface LinkProps {
    text: string,
    page: PageName
};

const Link: React.FC<LinkProps> = ({ text, page }) => {
    const handleClick = useCallback(() => {
        store.currentPage = page;
    }, [page]);

    return (
        <div className="btn" onClick={handleClick}>
            {text}
        </div>
    )
}
export default Link;