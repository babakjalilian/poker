import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/game/card/Card';

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

export const TwoOfSpades: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    value: '2',
    suit: '♠'
  }
};

export const ThreeOfSpades: Story = {
  args: {
    value: '3',
    suit: '♠'
  }
};

export const FourOfSpades: Story = {
  args: {
    value: '4',
    suit: '♠'
  }
};

export const FiveOfSpades: Story = {
  args: {
    value: '5',
    suit: '♠'
  }
};

export const SixOfSpades: Story = {
  args: {
    value: '6',
    suit: '♠'
  }
};

export const SevenOfSpades: Story = {
  args: {
    value: '7',
    suit: '♠'
  }
};

export const EightOfSpades: Story = {
  args: {
    value: '8',
    suit: '♠'
  }
};

export const NineOfSpades: Story = {
  args: {
    value: '9',
    suit: '♠'
  }
};

export const TenOfSpades: Story = {
  args: {
    value: '10',
    suit: '♠'
  }
};

export const JackOfSpades: Story = {
  args: {
    value: 'J',
    suit: '♠'
  }
};

export const QueenOfSpades: Story = {
  args: {
    value: 'Q',
    suit: '♠'
  }
};

export const KingOfSpades: Story = {
  args: {
    value: 'K',
    suit: '♠'
  }
};

export const AceOfSpades: Story = {
  args: {
    value: 'A',
    suit: '♠'
  }
};


export const TwoOfClubs: Story = {
  args: {
    value: '2',
    suit: '♣'
  }
};

export const ThreeOfClubs: Story = {
  args: {
    value: '3',
    suit: '♣'
  }
};

export const FourOfClubs: Story = {
  args: {
    value: '4',
    suit: '♣'
  }
};

export const FiveOfClubs: Story = {
  args: {
    value: '5',
    suit: '♣'
  }
};

export const SixOfClubs: Story = {
  args: {
    value: '6',
    suit: '♣'
  }
};

export const SevenOfClubs: Story = {
  args: {
    value: '7',
    suit: '♣'
  }
};

export const EightOfClubs: Story = {
  args: {
    value: '8',
    suit: '♣'
  }
};

export const NineOfClubs: Story = {
  args: {
    value: '9',
    suit: '♣'
  }
};

export const TenOfClubs: Story = {
  args: {
    value: '10',
    suit: '♣'
  }
};

export const JackOfClubs: Story = {
  args: {
    value: 'J',
    suit: '♣'
  }
};

export const QueenOfClubs: Story = {
  args: {
    value: 'Q',
    suit: '♣'
  }
};

export const KingOfClubs: Story = {
  args: {
    value: 'K',
    suit: '♣'
  }
};

export const AceOfClubs: Story = {
  args: {
    value: 'A',
    suit: '♣'
  }
};


export const TwoOfHearts: Story = {
  args: {
    value: '2',
    suit: '♥'
  }
};

export const ThreeOfHearts: Story = {
  args: {
    value: '3',
    suit: '♥'
  }
};

export const FourOfHearts: Story = {
  args: {
    value: '4',
    suit: '♥'
  }
};

export const FiveOfHearts: Story = {
  args: {
    value: '5',
    suit: '♥'
  }
};

export const SixOfHearts: Story = {
  args: {
    value: '6',
    suit: '♥'
  }
};

export const SevenOfHearts: Story = {
  args: {
    value: '7',
    suit: '♥'
  }
};

export const EightOfHearts: Story = {
  args: {
    value: '8',
    suit: '♥'
  }
};

export const NineOfHearts: Story = {
  args: {
    value: '9',
    suit: '♥'
  }
};

export const TenOfHearts: Story = {
  args: {
    value: '10',
    suit: '♥'
  }
};

export const JackOfHearts: Story = {
  args: {
    value: 'J',
    suit: '♥'
  }
};

export const QueenOfHearts: Story = {
  args: {
    value: 'Q',
    suit: '♥'
  }
};

export const KingOfHearts: Story = {
  args: {
    value: 'K',
    suit: '♥'
  }
};

export const AceOfHearts: Story = {
  args: {
    value: 'A',
    suit: '♥'
  }
};


export const TwoOfDiamonds: Story = {
  args: {
    value: '2',
    suit: '♦'
  }
};

export const ThreeOfDiamonds: Story = {
  args: {
    value: '3',
    suit: '♦'
  }
};

export const FourOfDiamonds: Story = {
  args: {
    value: '4',
    suit: '♦'
  }
};

export const FiveOfDiamonds: Story = {
  args: {
    value: '5',
    suit: '♦'
  }
};

export const SixOfDiamonds: Story = {
  args: {
    value: '6',
    suit: '♦'
  }
};

export const SevenOfDiamonds: Story = {
  args: {
    value: '7',
    suit: '♦'
  }
};

export const EightOfDiamonds: Story = {
  args: {
    value: '8',
    suit: '♦'
  }
};

export const NineOfDiamonds: Story = {
  args: {
    value: '9',
    suit: '♦'
  }
};

export const TenOfDiamonds: Story = {
  args: {
    value: '10',
    suit: '♦'
  }
};

export const JackOfDiamonds: Story = {
  args: {
    value: 'J',
    suit: '♦'
  }
};

export const QueenOfDiamonds: Story = {
  args: {
    value: 'Q',
    suit: '♦'
  }
};

export const KingOfDiamonds: Story = {
  args: {
    value: 'K',
    suit: '♦'
  }
};

export const AceOfDiamonds: Story = {
  args: {
    value: 'A',
    suit: '♦'
  }
};


export const Faded: Story = {
  args: {
    value: '2',
    suit: '♥',
    isFaded: true
  }
};
export const Hidden: Story = {
  args: {
    value: '2',
    suit: '♠',
    isHidden: true
  }
};
