import tint from './index.js'

export default (element, template, doc) => {
  doc = doc || document
  const compile = tint((tagName, attributes, children) => {
    const element = doc.createElement(tagName)
    Object.keys(attributes).forEach(key => {
      const v = attributes[key]
      if (typeof v == 'function') {
        element.addEventListener(
          key.substr(key.substr(0, 2) == 'on' ? 2 : 0), v
        )
      } else if (v != null && v !== false) {
        element.setAttribute(key, v === true ? '' : v)
      }
    })
    children.forEach(child => {
      element.appendChild(child)
    })
    return element
  }, str => doc.createTextNode(str), doc)
  const render = compile(element, template)
  var e = element
  return scope => {
    const x = render(scope)
    e.replaceWith(x)
    return x
  }
}
