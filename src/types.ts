import Store from "./Store";

export type PageName = "Menu" | "Game" | "Settings";
export type SuitSymbol = "♦" | "♣" | "♥" | "♠";
export type CardNameSymbol = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export type StoreType = typeof Store;
