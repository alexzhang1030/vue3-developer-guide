const basicConfig = require('./configs/index')

module.exports = {
  title: 'Vue 3 开发指南',
  base: '/vue3-developer-guide/',
  themeConfig: {
    nav: basicConfig.navbar,
  },
  extraWatchFiles: ['.vuepress/config.js', '01-Vue3/*.md'],
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    [
      'vuepress-plugin-auto-sidebar',
      {
        sidebarDepth: 2,
        sort: {
          readmeFirstForce: true,
        },
      },
    ],
  ],
}
