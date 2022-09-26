import tint from './index.js'

const render = tint()

export default (el, template, scope) => {
  while (el.childNodes.length) {
    el.removeChild(el.childNodes[0])
  }
  const res = render(template, scope)
  while (res.childNodes.length) {
    el.appendChild(res.childNodes[0])
  }
}
