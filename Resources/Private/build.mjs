import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import extensibilityMap from '@neos-project/neos-ui-extensibility/extensibilityMap.json' assert { type: 'json' }

const isWatchMode = process.argv.includes('--watch')

/**
 * This file contains the JS/CSS bundler configuration, as executed on `npm run build`
 */
/* esbuild
    .build({
        // Generic Options (shared between build.js and build-watch.js)
        entryPoints: {
            BackendModal: './BackendModal/src/index.js',
            main: './main.scss'
        },
        sourceRoot: './BackendModal/src',
        target: ['esnext'],
        // To prevent shortening of top, right, bottom, left into inset because it is not well supported yet (https://github.com/evanw/esbuild/pull/1758/files)
        supported: { 'inset-property': false },
        bundle: true,
        sourcemap: isWatchMode,
        plugins: [sassPlugin({ watch: isWatchMode })],
        outdir: '../Public/',
        loader: {
            '.js': 'jsx',
            '.json': 'json'
        },

        // Specific options for "npm run build"
        minify: false,
        //watch: isWatchMode,
        external: ['react'],
        alias: extensibilityMap
    })
    .then(ctx => ctx.watch())
    .catch(() => process.exit(1)) */

if (isWatchMode) {
    console.log('Watching for changes...');
    esbuild
        .context({
            entryPoints: {
                BackendModal: './BackendModal/src/index.js',
                main: './main.scss'
            },
            sourceRoot: './BackendModal/src',
            target: ['esnext'],
            supported: { 'inset-property': false },
            bundle: true,
            sourcemap: true,
            plugins: [sassPlugin({ watch: true })],
            outdir: '../Public/',
            loader: {
                '.js': 'jsx',
                '.json': 'json'
            },
            minify: false,
            external: ['react', '/_Resources/*'],
            alias: extensibilityMap
        })
        .then(ctx => ctx.watch())
        .catch(() => process.exit(1));
} else {
    esbuild
        .build({
            entryPoints: {
                BackendModal: './BackendModal/src/index.js',
                main: './main.scss'
            },
            sourceRoot: './BackendModal/src',
            target: ['esnext'],
            supported: { 'inset-property': false },
            bundle: true,
            sourcemap: false,
            plugins: [sassPlugin()],
            outdir: '../Public/',
            loader: {
                '.js': 'jsx',
                '.json': 'json'
            },
            minify: false,
            external: ['react', '/_Resources/*'],
            alias: extensibilityMap
        })
        .catch(() => process.exit(1));
}
