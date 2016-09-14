import webpack from 'webpack'
import cssnano from 'cssnano'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config from './index.js'
import _debug from 'debug'


const debug = _debug('app:webpack:config')
const paths = config.utils_paths
const {__DEV__, __PROD__, __TEST__} = config.globals

debug('Create configuration.')
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : config.compiler_devtool,
  resolve : {
    mainFields : ['jsnext:main', 'browser', 'main'],
    modules    : [
      paths.client(),
      'node_modules'
    ],
    extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass'],
  },
  module: {
    loaders: [],
  },
  modulesDirectories: [
    'node_modules',
  ]
}

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATHS = [
  paths.client('main.js')
]

webpackConfig.entry = {
  app: __DEV__
    ? APP_ENTRY_PATHS.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
    : APP_ENTRY_PATHS,
  vendor: config.compiler_vendor
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : `[name].[${config.compiler_hash_type}].js`,
  path       : paths.dist(),
  publicPath : config.compiler_public_path
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template : paths.client('index.html'),
    hash     : false,
    favicon  : paths.client('static/favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace: true
    }
  }),
]
if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
     new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused        : false,
        dead_code     : true,
        warnings      : false,
        properties    : true,
        drop_debugger : true,
        unsafe        : true,
        unsafe_comps  : true,
        conditionals  : true,
        comparisons   : true,

        sequences : true,
        join_vars : true,

        evaluate    : true,
        booleans    : true,
        loops       : true,
        hoist_funs  : true,
        if_return   : true,
        cascade     : true,
        negate_iife : true,
      },
      comments: false,
    }),
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  )
}
// ------------------------------------
// Pre-Loaders
// ------------------------------------
/*
[ NOTE ]
We no longer use eslint-loader due to it severely impacting build
times for larger projects. `npm run lint` still exists to aid in
deploy processes (such as with CI), and it's recommended that you
use a linting plugin for your IDE in place of this loader.
If you do wish to continue using the loader, you can uncomment
the code below and run `npm i --save-dev eslint-loader`. This code
will be removed in a future release.
*/
webpackConfig.module.preLoaders = [{
  test    : /\.(js|jsx)$/,
  loader  : 'eslint-loader',
  exclude : /node_modules/,
}]
webpackConfig.eslint = {
  configFile  : paths.base('.eslintrc'),
  emitWarning : __DEV__,
  fix         : true,
  cache       : true,
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
var babelSettings = {
  cacheDirectory : true,
  presets        : [
    ['es2015', {
      modules: false,
    }],
    'stage-0', 'react'
  ],
  plugins: [
    ['transform-decorators-legacy'],
    ['transform-promise-to-bluebird'],
    ['transform-async-to-module-method', {
      'module' : 'bluebird',
      'method' : 'coroutine',
    }],
  ],
  env: {
    production: {
      presets: ['react-optimize'],
    }
  },
}
webpackConfig.module.loaders.push({
  test    : /\.(js|jsx)$/,
  exclude : /(?=.*\b(node_modules)\b)(?!.*\b(node_modules\/[\w\.-]+\/(?:src|es)|react-router|redux-router|redux-saga|react-reinput|react-bootstrap-multiselect|react-tag-input|reat-bootstrap-datetimepicker|react-tag-input|react-dnd-html5-backend)\b)(.+)/i, // eslint-disable-line max-len
  loaders : [
    'babel?' + JSON.stringify(babelSettings),
  ]
})
webpackConfig.module.loaders.push({
  test   : /\.json$/,
  loader : 'json'
})

// -- proto loaders
webpackConfig.module.loaders.push({
  test   : /\.proto$/,
  loader : 'proto-loader'
})

webpackConfig.module.loaders.push({
  test       : /\.tsx?$/,
  preLoaders : [
    {
      test   : /\.tsx?$/,
      loader : 'tslint'
    }
  ],
  loaders: [
    'awesome-typescript-loader',
  ],
  tslint: {
    emitErrors : true,
    failOnHint : true
  }
})

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

// Add any packge names here whose styles need to be treated as CSS modules.
// These paths will be combined into a single regex.
const PATHS_TO_TREAT_AS_CSS_MODULES = [
  'react-toolbox', 'susy', 'compass-mixins'
]

// If config has CSS modules enabled, treat this project's styles as CSS modules.
if (config.compiler_css_modules) {
  PATHS_TO_TREAT_AS_CSS_MODULES.push(
    paths.client().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
  )
}

const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)


// Loaders for styles that need to be treated as CSS modules.
if (isUsingCSSModules) {
  const cssModulesLoader = [
    BASE_CSS_LOADER,
    'modules',
    'importLoaders=1',
    'localIdentName=[name]__[local]___[hash:base64:5]'
  ].join('&')

  webpackConfig.module.loaders.push({
    test    : /\.(scss|sass)$/,
    include : cssModulesRegex,
    exclude : /\.var\.(scss|sass)$/,
    loaders : [
      'style',
      cssModulesLoader,
      'postcss',
      'sass?sourceMap'
    ]
  })

  webpackConfig.module.loaders.push({
    test    : /\.css$/,
    include : cssModulesRegex,
    exclude : /\.var\.(scss|sass)$/,
    loaders : [
      'style',
      cssModulesLoader,
      'postcss'
    ]
  })
}

// Loaders for files that should not be treated as CSS modules.
const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
webpackConfig.module.loaders.push({
  test    : /\.(scss|sass)$/,
  exclude : [excludeCSSModules, /\.var\.(scss|sass)$/],
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.css$/,
  exclude : [excludeCSSModules, /\.var\.(scss|sass)$/],
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.var\.(scss|sass)$/,
  loaders : ['sass-variable-loader'],
})

// ------------------------------------
// Style Configuration
// ------------------------------------
webpackConfig.sassLoader = {
  data         : '@import "var";',
  includePaths : [
    paths.client('styles'),
    'node_modules',
    'react-toolbox/lib'
  ]
}

webpackConfig.postcss = [
  cssnano({
    autoprefixer: {
      add      : true,
      remove   : true,
      browsers : ['> 0%']
    },
    discardComments: {
      removeAll: true
    },
    discardUnused : false,
    mergeIdents   : false,
    reduceIdents  : false,
    safe          : true,
    sourcemap     : true,
  })
]

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.')
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const [first, ...rest] = loader.loaders
    loader.loader = ExtractTextPlugin.extract({fallbackLoader: first, loader: rest})
    Reflect.deleteProperty(loader, 'loaders')
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename  : '[name].[contenthash].css',
      allChunks : true,
    }),
  )
}

export default webpackConfig
