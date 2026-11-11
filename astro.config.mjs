// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kreox.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  image: { responsiveStyles: true },
});
