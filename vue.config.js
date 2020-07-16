module.exports = {
  publicPath: './',
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  
  //webpack配置
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  configureWebpack: config => {
    //调试JS
    config.devtool = "source-map";
    
  },
  css: {
    sourceMap: true // 开启 CSS source maps?
  }
};
