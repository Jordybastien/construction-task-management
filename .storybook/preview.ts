import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      description: {
        component: 'Construction Task Manager UI Components'
      }
    },
    a11y: {
      test: 'todo',
    },
  }
};

export default preview;
