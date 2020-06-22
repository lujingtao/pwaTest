module.exports = {
  publicPath: './',
  //productionSourceMap: true, // 生产环境是否生成 sourceMap 文件

  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  
  css: {
    sourceMap: true // 开启 CSS source maps?
  }
};
