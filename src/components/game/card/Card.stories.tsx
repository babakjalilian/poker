import type { Meta, StoryObj } from '@storybook/react';
import { cardSymbols, suitSymbols } from '../../../Consts';
import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'Example/Card',
  component: Card,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
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

export const Default: Story = {
  args: {
    value: '2',
    suit: '♠',
  }
};

const CardsTemplate: Story = {
  render: ({ isFaded }) => (
    <>
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
      <div key={'hidden-card'} style={{ paddingTop: '10px' }}>
        <Card suit={'♠'} value={'2'} isHidden={true} isFaded={false} />
      </div>
    </>
  )
};

export const AllCards = {
  ...CardsTemplate,
  args: {
    isFaded: false,
  },
  argTypes: {
    // foo is the property we want to remove from the UI
    suit: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
    isHidden: {
      table: {
        disable: true,
      },
    },
  }
};


