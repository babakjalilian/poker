import { inject } from 'mobx-react';
import React, { useCallback } from 'react';
import { PageName, StoreType } from "../../types";
import "./Link.scss";

interface LinkProps {
    text: string,
    page: PageName,
    onPress?: () => void,
    store?: StoreType
};

const Link: React.FC<LinkProps> = inject('store')(({ text, page, onPress, store }) => {

    const handleClick = useCallback(() => {
        store.currentPage = page;
        onPress && onPress();
    }, []);

    return (
        <div className="btn" onClick={handleClick}>
            {text}
        </div>
    )
})
export default Link;