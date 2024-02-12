const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./src/assets/scss'] // Point to the directory containing variables.scss
        }
      }
    }
  }
})
