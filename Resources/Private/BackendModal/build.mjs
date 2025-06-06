import esbuild from 'esbuild'
import extensibilityMap from '@neos-project/neos-ui-extensibility/extensibilityMap.json' assert { type: 'json' }

const isWatchMode = process.argv.includes('--watch')

/**
 * This file contains the JS/CSS bundler configuration, as executed on `npm run build`
 */
esbuild
    .build({
        // Generic Options (shared between build.js and build-watch.js)
        entryPoints: ['./src/index.js'],
        sourceRoot: './src',
        target: ['esnext'],
        // To prevent shortening of top, right, bottom, left into inset because it is not well supported yet (https://github.com/evanw/esbuild/pull/1758/files)
        supported: { 'inset-property': false },
        bundle: true,
        sourcemap: isWatchMode,
        outfile: '../../Public/JavaScript/BackendModal.js',
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
    .catch(() => process.exit(1))
