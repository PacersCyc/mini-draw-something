module.exports = {
  plugins: {
    autoprefixer: {
      Browserslist: [
        'Android >= 4.0'
      ]
    },
    "postcss-pxtorem": {
      rootValue: 16,
      propList: [
        '*'
      ],
      selectorBlackList: [
        'font-size'
      ]
    }
  }
}