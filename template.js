import tint from './index.js'

const compile = tint()

export default (element, template) => {
  const render = compile(element, template)
  var e = element
  return scope => {
    const x = render(scope)
    e.replaceWith(x)
    e = x
  }
}
