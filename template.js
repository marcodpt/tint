import tint from './index.js'

const render = tint()

export default (templateId, state, node) => {
  const res = render(templateId, state)
  if (!node) {
    return res
  }
  while (node.childNodes.length) {
    node.removeChild(node.childNodes[0])
  }
  while (res.childNodes.length) {
    node.appendChild(res.childNodes[0])
  }
}
