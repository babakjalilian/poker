import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/game/card/Card';

const meta: Meta<typeof Card> = {
    title: 'Example/Card',
    component: Card,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
};


export default meta;
type Story = StoryObj<typeof Card>;

export const TwoOfSpades: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args
    args: {
        value: "2",
        suit: "♠"
    },
};
export const TwoOfClubs: Story = {
    args: {
        value: "2",
        suit: '♣'
    },
};
export const TwoOfHearts: Story = {
    args: {
        value: "2",
        suit: '♥'
    },
};
export const TwoOfDiamonds: Story = {
    args: {
        value: "2",
        suit: '♦'
    },
};
export const Faded: Story = {
    args: {
        value: "2",
        suit: '♥',
        isFaded: true
    },
};
export const Hidden: Story = {
    args: {
        value: "2",
        suit: "♠",
        isHidden: true
    },
};