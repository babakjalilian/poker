import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/game/card/Card';
import { cardSymbols, suitSymbols } from '../Consts';

const meta: Meta<typeof Card> = {
  title: 'Example/Card',
  component: Card,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Card>;
type StoryForAllCards = StoryObj<{ isFaded: boolean }>;

export const Hidden: Story = {
  args: {
    value: '2',
    suit: '♠',
    isHidden: true
  }
};

const CardsTemplate: StoryForAllCards = {
  render: ({ isFaded }) => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {
        Object.values(suitSymbols).map(suitSymbol => {
          return (
            <div key={suitSymbol} style={{ display: 'flex', gap: '10px' }}>
              {
                Object.values(cardSymbols).map(cardSymbol => {
                  return <Card key={`${cardSymbol}-${suitSymbol}`} suit={suitSymbol} value={cardSymbol} isHidden={false} isFaded={isFaded} />
                })
              }
            </div>
          )
        })
      }
    </div>
  )
};

export const AllCards = {
  ...CardsTemplate,
  args: {
    isFaded: false,
  }
};

export const AllCardsFaded = {
  ...CardsTemplate,
  args: {
    isFaded: true,
  }
};

