import babel from 'rollup-plugin-babel';
import browsersync from 'rollup-plugin-browsersync'
import postcss from 'rollup-plugin-postcss';
import progress from 'rollup-plugin-progress';
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser';
import { version, description, homepage, author, license } from './package.json'

const OUTPUT = 'dist'
const production = !process.env.ROLLUP_WATCH;
const sourcemap = !production ? 'inline' : false;

const banner = `/**
 * Tipster - v${version}
 * ${description}
 * ${homepage}
 * Copyright (c) ${new Date().getFullYear()} ${author}.
 * ${license} License
 */`;

export default {
  input: './src/tipster.js',
  output: {
    file: `${OUTPUT}/tipster.js`,
    format: 'umd',
    name: 'Tipster',
    sourcemap
  },
  plugins: [
    production && del({
      targets: [`${OUTPUT}/*`, `!${OUTPUT}/index.html`],
      verbose: true
    }),
    progress(),
    babel({
      exclude: 'node_modules/**'
    }),
    !production &&
      browsersync({
        open: false,
        server: 'dist'
      }),
    production &&
      terser({
        output: { preamble: banner }
      }),
    postcss({
      extract: `${OUTPUT}/tipster.css`,
      minimize: false
    })
  ]
}