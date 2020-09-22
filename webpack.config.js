const path = require('path');
const glob = require('glob');
const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
if(process.env.NODE_ENV== "build"){
    var website={
        publicPath:"http://localhost:7870/"
    }
}else{
    var website={
        publicPath:"http://localhost:7870/"
    }
}
module.exports={
    //增加调试
    devtool: 'eval-source-map',
    //入口文件的配置项
    // entry: ["./src/entry.js","./src/js/index.js"],
    entry:{
        entry:'./src/entry.js'
        //entry2:'./src/js/index.js'
    },
    //出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path: path.resolve(__dirname, "dist"), //将js文件打包到dist/js的目录
        filename: "js/[name].js", //使用[name]打包出来的js文件会分别按照入口文件配置的属性来命名.多文件打包成一个js默认命名成main.js
        publicPath: website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules: [
            {
                test: /\.(css|less)$/,
                use: extractTextPlugin.extract({   // css代码分离插件
                    fallback: "style-loader",
                    use:[{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    },
                    // {
                    //     loader: "sass-loader"
                    // }
                        'postcss-loader',  // 对css新特性，自动补全前缀，需和插件autoprefixer（自动添加前缀的插件）一起使用，此外还需在该配置文件的同级目录下新建postcss.config.js文件，默认只会补全-webkit-前缀，如需补全其他前缀需在package.json中添加browserslist参数配置
                ],
                    publicPath:'../'    // TODO 解决分离后的css的图片url路径问题
                })
            },
            {
                test:/\.(png|jpg|gif)/ ,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:8192, // 小于8192字节的图片打包成base 64图片
                        name: 'images/[name].[hash:8].[ext]',
                        esModule: false,//解决图片格式出现[object Object]
                        outputPath:'images/',
                    }
                }]
             },
             {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            }
          ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'

        }),
        new extractTextPlugin("/css/index.css"),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:7870
    },
    watch: true
}