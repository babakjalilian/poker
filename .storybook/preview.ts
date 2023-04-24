import type { Preview } from "@storybook/react";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        backgrounds: {
            default: 'green',
            values: [
                { name: 'green', value: '#1f7214' },
                { name: 'white', value: '#ffffff' },
                { name: 'black', value: '#222222' },
            ]
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
