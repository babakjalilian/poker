import { createContext, useContext, type ReactNode } from 'react';
import Store from '../stores/Store';

let store: Store;

const StoreContext = createContext<Store | undefined>(undefined);

export function StoreProvider ({ children }: { children: ReactNode }): JSX.Element {
  // only create the store once ( store is a singleton)
  const rootStore = store ?? new Store();

  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
}

export function useStore (): Store {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
