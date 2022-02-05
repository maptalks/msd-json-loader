const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const production = process.env.BUILD === 'production';
const plugins = production ? [terser({
    mangle: {
        properties: {
            'regex' : /^_/,
            'keep_quoted' : true
        }
    },
    output : {
        keep_quoted_props: true,
        beautify: true,
        comments : '/^!/'
    }
})] : [];

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n * (c) 2016-${new Date().getFullYear()} maptalks.com\n */`;
const outro = `typeof console !== 'undefined' && console.log('${pkg.name} v${pkg.version}');`;
const configPlugins = [
    
];

module.exports = [
    {
        input: 'src/index.js',
        plugins: configPlugins.concat(plugins),
        external : [],
        output: {
            'sourcemap': production ? false : 'inline',
            'format': 'es',
            'globals' : {
                'maptalks' : 'maptalks'
            },
            banner,
            'file': pkg.module
        },
        watch: {
            include: ['src/**/*.js']
        }
    },
    {
        input: 'src/index.js',
        plugins: configPlugins,
        external : [],
        output: {
            'sourcemap': false,
            'format': 'umd',
            'extend': true,
            'name': 'maptalks',
            'globals' : {
                'maptalks' : 'maptalks'
            },
            banner,
            outro,
            'file': pkg.main
        },
        watch: {
            include: ['src/**/*.js']
        }
    }
];
