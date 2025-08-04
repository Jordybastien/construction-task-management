import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/containers/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  staticDirs: ['../public'],
  build: {
    test: {
      disableBlocks: true,
      disableSourcemaps: true,
    }
  },
  // Hack for translation, this should've been fixed in the component level
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-i18next': require.resolve('./i18n.ts')
    };
    return config;
  }
};
export default config;