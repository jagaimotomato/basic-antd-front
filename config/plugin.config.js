const ThemeColorReplacer = require('webpack-theme-color-replacer')
const generate = require('@ant-design/colors/lib/generate').default

const getAntdSerials = (color) => {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  const rgb = ThemeColorReplacer.varyColor.toNum3(color.replace('#', '')).join(',')
  return lightens.concat(colorPalettes).concat(rgb)
}

const themePluginOption = {
  fileName: 'css/theme-colors-[contenthash:8].css',
  matchColors: getAntdSerials('#1890ff'), // 主色系列
  // 改变样式选择器，解决样式覆盖问题
  changeSelector (selector) {
    switch (selector) {
      case '.ant-calendar-today .ant-calendar-date':
        return ':not(.ant-calendar-selected-date):not(.ant-calendar-selected-day)' + selector
      case '.ant-btn:focus,.ant-btn:hover':
        return '.ant-btn:focus:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:hover:not(.ant-btn-primary):not(.ant-btn-danger)'
      case '.ant-btn.active,.ant-btn:active':
        return '.ant-btn.active:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:active:not(.ant-btn-primary):not(.ant-btn-danger)'
      case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
      case '.ant-steps-item-process .ant-steps-item-icon>.ant-steps-icon':
        return ':not(.ant-steps-item-process)' + selector
      // fixed https://github.com/vueComponent/ant-design-vue-pro/issues/876
      case '.ant-steps-item-process .ant-steps-item-icon':
        return ':not(.ant-steps-item-custom)' + selector
      case '.ant-permission-horizontal>.ant-permission-item-active,.ant-permission-horizontal>.ant-permission-item-open,.ant-permission-horizontal>.ant-permission-item-selected,.ant-permission-horizontal>.ant-permission-item:hover,.ant-permission-horizontal>.ant-permission-submenu-active,.ant-permission-horizontal>.ant-permission-submenu-open,.ant-permission-horizontal>.ant-permission-submenu-selected,.ant-permission-horizontal>.ant-permission-submenu:hover':
      case '.ant-permission-horizontal > .ant-permission-item-active,.ant-permission-horizontal > .ant-permission-item-open,.ant-permission-horizontal > .ant-permission-item-selected,.ant-permission-horizontal > .ant-permission-item:hover,.ant-permission-horizontal > .ant-permission-submenu-active,.ant-permission-horizontal > .ant-permission-submenu-open,.ant-permission-horizontal > .ant-permission-submenu-selected,.ant-permission-horizontal > .ant-permission-submenu:hover':
        return '.ant-permission-horizontal > .ant-permission-item-active,.ant-permission-horizontal > .ant-permission-item-open,.ant-permission-horizontal > .ant-permission-item-selected,.ant-permission-horizontal:not(.ant-permission-dark) > .ant-permission-item:hover,.ant-permission-horizontal > .ant-permission-submenu-active,.ant-permission-horizontal > .ant-permission-submenu-open,.ant-permission-horizontal:not(.ant-permission-dark) > .ant-permission-submenu-selected,.ant-permission-horizontal:not(.ant-permission-dark) > .ant-permission-submenu:hover'
      case '.ant-permission-horizontal > .ant-permission-item-selected > a':
      case '.ant-permission-horizontal>.ant-permission-item-selected>a':
        return '.ant-permission-horizontal:not(ant-permission-light):not(.ant-permission-dark) > .ant-permission-item-selected > a'
      case '.ant-permission-horizontal > .ant-permission-item > a:hover':
      case '.ant-permission-horizontal>.ant-permission-item>a:hover':
        return '.ant-permission-horizontal:not(ant-permission-light):not(.ant-permission-dark) > .ant-permission-item > a:hover'
      default :
        return selector
    }
  }
}

const createThemeColorReplacerPlugin = () => new ThemeColorReplacer(themePluginOption)

module.exports = createThemeColorReplacerPlugin
