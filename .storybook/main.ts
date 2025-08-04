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
  // Fix for Vercel deployment - set base URL for assets
  managerHead: (head) => `
    ${head}
    <base href="/storybook/" />
  `,
  // Hack for translation, this should've been fixed in the component level
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-i18next': require.resolve('./i18n.ts')
    };
    
    // Set base path for production deployment
    if (process.env.NODE_ENV === 'production' || process.env.STORYBOOK_BASE_URL) {
      config.base = '/storybook/';
    }
    
    return config;
  }
};
export default config;