import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import extensibilityMap from '@neos-project/neos-ui-extensibility/extensibilityMap.json' with { type: 'json' }

const isWatchMode = process.argv.includes('--watch')

/**
 * This file contains the JS/CSS bundler configuration, as executed on `yarn build`
 */

const defaultOptions = {
    entryPoints: {
        BackendModal: './BackendModal/src/index.js',
        main: './main.ts',
        styles: './main.scss'
    },
    sourceRoot: './BackendModal/src',
    target: ['esnext'],
    supported: { 'inset-property': false },
    bundle: true,
    sourcemap: true,
    plugins: [sassPlugin({ watch: isWatchMode })],
    outdir: '../Public/',
    loader: {
        '.js': 'jsx',
        '.json': 'json'
    },
    minify: false,
    external: ['react', '/_Resources/*'],
    alias: extensibilityMap
}


if (isWatchMode) {
    console.log('Watching for changes...');
    esbuild
        .context(defaultOptions)
        .then(ctx => ctx.watch())
        .catch(() => process.exit(1));
} else {
    esbuild
        .build({
            ...defaultOptions,
            minify: true,
        })
        .catch(() => process.exit(1));
}
