import tint from './index.js'

const compile = tint()

export default element => {
  const render = compile(element)
  var e = element
  return scope => {
    const x = render(scope)
    e.replaceWith(x)
    e = x
  }
}
