function initRem() {
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  console.log(htmlWidth)
  let htmlDom = document.querySelector('html')
  let ratio = 375 / 16
  htmlDom.style.fontSize = htmlWidth / ratio + 'px'
}

initRem()

// window.addEventListener('resize', () => {
//   initRem()
// })