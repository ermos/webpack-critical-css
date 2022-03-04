const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const CriticalCssPlugin = require('critical-css-webpack-plugin')

module.exports = () => {
    const critical = []

    // We retrieve all html pages from your src folder
    fs.readdirSync(path.join(__dirname, 'src')).forEach(file => {
        if (/.html$/.test(file)) {
            critical.push(new CriticalCssPlugin({
                base: path.resolve(__dirname, 'src'),
                src: file,
                target: path.resolve(__dirname, 'dist', file),
                inline: true,
                extract: true,
                width: 375,
                height: 565
            }))
        }
    })

    return {
        entry: [
            path.resolve(__dirname, 'src/scss/app.scss')
        ],
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/',
        },
        optimization: {
            removeEmptyChunks: true,
        },
        module: {
            rules: [
                // CSS
                {
                    test: /\.scss?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {esModule: true}
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        "sass-loader",
                    ],
                }
            ]
        },
        plugins: [
            new RemoveEmptyScriptsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            ...critical,
        ],
    }
}
