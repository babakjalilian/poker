import type { Meta, StoryObj } from '@storybook/react';
import Player from '../components/game/player/Player';
import Card from '../stores/Card';

const meta: Meta<typeof Player> = {
    title: 'Example/Player',
    component: Player,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ position: 'absolute' }}>
                <Story />
            </div>
        ),
    ],
};


export default meta;
type Story = StoryObj<typeof Player>;

const cards = [new Card("hearts", "ace"), new Card("spades", "king"),]

export const BigBlindPlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: false,
        isActivePlayer: false,
        isBigBlindPlayer: true,
        isSmallBlindPlayer: false,
        isWinner: false,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
export const SmallBlindPlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: false,
        isActivePlayer: false,
        isBigBlindPlayer: false,
        isSmallBlindPlayer: true,
        isWinner: false,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
export const ActivePlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: false,
        isActivePlayer: true,
        isBigBlindPlayer: false,
        isSmallBlindPlayer: false,
        isWinner: false,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
export const NormalPlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: false,
        isActivePlayer: false,
        isBigBlindPlayer: false,
        isSmallBlindPlayer: false,
        isWinner: false,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
export const WinnerPlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: false,
        isActivePlayer: false,
        isBigBlindPlayer: false,
        isSmallBlindPlayer: false,
        isWinner: true,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
export const FoldedPlayerInfo: Story = {
    args: {
        playerId: 0,
        name: "player-0",
        hasFolded: true,
        isActivePlayer: false,
        isBigBlindPlayer: false,
        isSmallBlindPlayer: false,
        isWinner: false,
        sumOfPersonalBetsInThisRound: 200,
        moneyLeft: 800,
        cards: cards
    },
};
