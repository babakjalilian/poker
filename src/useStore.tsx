import { createContext, ReactNode, useContext } from "react";
import Store from "./Store";

let store: Store;

const StoreContext = createContext<Store | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    //only create the store once ( store is a singleton)
    const root = store ?? new Store()

    return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>
}

export function useStore() {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error("useRootStore must be used within StoreProvider")
    }
    return context
}