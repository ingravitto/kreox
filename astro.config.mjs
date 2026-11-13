// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kreox.es',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  image: { responsiveStyles: true },
});
